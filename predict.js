let imageLoaded = false;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selectedImage").attr("src", dataURL);
		removeHighlights();
		imageLoaded = true;
	}
	
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

function showProgress(percentage) {
	var pct = Math.floor(percentage*100.0);
	$('.progress-bar').html(`Loading Model (${pct}%)`);
	console.log(`${pct}% loaded`);
}

let model;
let is_new_od_model;
let modelLoaded = false;
$( document ).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').html("Loading Model");
	$('.progress-bar').show();
    console.log( "Loading model..." );
	model = await tf.loadGraphModel('model/model.json', {onProgress: showProgress});
	is_new_od_model = model.inputs.length == 3;
	console.log( "Model loaded." );
	$('.progress-bar').hide();
	modelLoaded = true;
});

function _logistic(x) {
	if (x > 0) {
	    return (1 / (1 + Math.exp(-x)));
	} else {
	    const e = Math.exp(x);
	    return e / (1 + e);
	}
}

async function loadImage(onProgress) {
	console.log( "Pre-processing image..." );
	await $('.progress-bar').html("Pre-processing image").promise();
	
	const pixels = $('#selectedImage').get(0);
		
	// Pre-process the image
	const input_size = model.inputs[0].shape[1];
	let image = tf.browser.fromPixels(pixels, 3);
	image = tf.image.resizeBilinear(image.expandDims().toFloat(), [input_size, input_size]);
	if (is_new_od_model) {
		console.log( "Object Detection Model V2 detected." );
		image = is_new_od_model ? image : image.reverse(-1); // RGB->BGR for old models
	}

	return image;
}

const ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];
const NEW_OD_OUTPUT_TENSORS = ['detected_boxes', 'detected_scores', 'detected_classes'];
async function predictLogos(inputs) {
	console.log( "Running predictions..." );
	await $('.progress-bar').html("Running predictions").promise();
	const outputs = await model.executeAsync(inputs, is_new_od_model ? NEW_OD_OUTPUT_TENSORS : null);
	const arrays = !Array.isArray(outputs) ? outputs.array() : Promise.all(outputs.map(t => t.array()));
	let predictions = await arrays;

	// Post processing for old models.
	if (predictions.length != 3) {
		console.log( "Post processing..." );
		await $('.progress-bar').html("Post-processing V1 model").promise();
	    const num_anchor = ANCHORS.length / 2;
		const channels = predictions[0][0][0].length;
		const height = predictions[0].length;
		const width = predictions[0][0].length;

		const num_class = channels / num_anchor - 5;

		let boxes = [];
		let scores = [];
		let classes = [];

		for (var grid_y = 0; grid_y < height; grid_y++) {
			for (var grid_x = 0; grid_x < width; grid_x++) {
				let offset = 0;

				for (var i = 0; i < num_anchor; i++) {
					let x = (_logistic(predictions[0][grid_y][grid_x][offset++]) + grid_x) / width;
					let y = (_logistic(predictions[0][grid_y][grid_x][offset++]) + grid_y) / height;
					let w = Math.exp(predictions[0][grid_y][grid_x][offset++]) * ANCHORS[i * 2] / width;
					let h = Math.exp(predictions[0][grid_y][grid_x][offset++]) * ANCHORS[i * 2 + 1] / height;

					let objectness = tf.scalar(_logistic(predictions[0][grid_y][grid_x][offset++]));
					let class_probabilities = tf.tensor1d(predictions[0][grid_y][grid_x].slice(offset, offset + num_class)).softmax();
					offset += num_class;

					class_probabilities = class_probabilities.mul(objectness);
					let max_index = class_probabilities.argMax();
					boxes.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
					scores.push(class_probabilities.max().dataSync()[0]);
					classes.push(max_index.dataSync()[0]);
				}
			}
		}

		boxes = tf.tensor2d(boxes);
		scores = tf.tensor1d(scores);
		classes = tf.tensor1d(classes);

		const selected_indices = await tf.image.nonMaxSuppressionAsync(boxes, scores, 10);
		predictions = [await boxes.gather(selected_indices).array(), await scores.gather(selected_indices).array(), await classes.gather(selected_indices).array()];
	}

	return predictions;
}

var children = [];
function removeHighlights() {
	for (let i = 0; i < children.length; i++) {
		imageOverlay.removeChild(children[i]);
	}
	children = [];
}
async function highlightResults(predictions) {
	console.log( "Highlighting results..." );
	await $('.progress-bar').html("Highlighting results").promise();

	removeHighlights();
	
	for (let n = 0; n < predictions[0].length; n++) {
		// Check scores
		if (predictions[1][n] > 0.66) {
			const p = document.createElement('p');
			p.innerText = TARGET_CLASSES[predictions[2][n]]  + ': ' 
				+ Math.round(parseFloat(predictions[1][n]) * 100) 
				+ '%';
			
			bboxLeft = (predictions[0][n][0] * selectedImage.width) + 10;
			bboxTop = (predictions[0][n][1] * selectedImage.height) - 10;
			bboxWidth = (predictions[0][n][2] * selectedImage.width) - bboxLeft + 20;
			bboxHeight = (predictions[0][n][3] * selectedImage.height) - bboxTop + 10;
			
			p.style = 'margin-left: ' + bboxLeft + 'px; margin-top: '
				+ (bboxTop - 10) + 'px; width: ' 
				+ bboxWidth + 'px; top: 0; left: 0;';
			const highlighter = document.createElement('div');
			highlighter.setAttribute('class', 'highlighter');
			highlighter.style = 'left: ' + bboxLeft + 'px; top: '
				+ bboxTop + 'px; width: ' 
				+ bboxWidth + 'px; height: '
				+ bboxHeight + 'px;';
			imageOverlay.appendChild(highlighter);
			imageOverlay.appendChild(p);
			children.push(highlighter);
			children.push(p);
		}
	}
}

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
	$('.progress-bar').html("Starting prediction");
	$('.progress-bar').show();

	const image = await loadImage();
	const predictions = await predictLogos(image);
	await highlightResults(predictions);

	$('.progress-bar').hide();
});
