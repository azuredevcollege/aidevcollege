# Challenge 6

Another way of creating models in Azure Machine Learning without coding is the **Azure Machine Learning Designer**. In this challenge, we'll take an automobile price data set and use the Designer to create our own machine learning pipeline to predict car prices.

The Designer offers a range of pre-built functions commonly used in machine learning problems, such as data cleaning, splitting, model training and evaluation. In addition, it allows users to run their own custom code written in Python or R. Similarly to **AutoML**, it enables data scientists, analysts, and developers to build ML models with high scale, efficiency, and productivity. However, it requires more input from the user and a more extensive knowledge of machine learning best practices than AutoML.

**When to use it?**

Use the Designer to use pre-built functions via drag-and-drop for the quick development of custom machine learning pipelines that support, but do not require coding. You can use the Designer to:

- Implement ML solutions without extensive programming knowledge, but with the option to add custom code
- Create data preprocessing pipelines, e.g. to handle missing values
- Save time and resources
- Leverage data science best practices
- Provide agile problem-solving

**How automated ML works?**
During training, Azure Machine Learning creates a number of pipelines in parallel that try different algorithms and parameters for you. The service iterates through ML algorithms paired with feature selections, where each iteration produces a model with a training score. The higher the score, the better the model is considered to "fit" your data. It will stop once it hits the exit criteria defined in the experiment.

**Note:** Automated Machine Learning can also [be used directly from the Azure Portal](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-portal-experiments). In this challenge, we'll use the Portal, in the next challenge, we'll be using code.

## Dataset

> All the mentioned datasets in challenge 4 and challenge 5 can be found in your locally cloned repository **`aidevcollege/day1/AzureMachineLearningService/data`**. 

For this challenge, we'll use the `Pima Indians Diabetes` dataset: The Pima Indians Diabetes Dataset involves predicting the onset of diabetes within 5 years in Pima Indians given medical details. Before getting started, have a look at the data set: [`pima-indians-diabetes.csv`](../data/pima-indians-diabetes.csv). As this dataset is controversially discussed we have added the following two documents: [blog](https://researchblog.duke.edu/2016/10/24/diabetes-and-privacy-meet-big-data/#:~:text=Generations%27%20worth%20of%20data%20on,pregnancies%20of%20Pima%20Native%20Americans.) and [paper](https://www.journals.uchicago.edu/doi/full/10.1086/693853?mobileUi=0&).

> *"This is where “eternal” medical consent enters the equation: no researcher can realistically inform a study participant of what their medical data will be used for 40 years in the future."*
> To make this sensitive topic aware we added this dataset as well as our Microsoft AI principles. 
> **Please be responsible and follow the:** [Microsoft responsible AI principles](https://www.microsoft.com/en-us/ai/responsible-ai?activetab=pivot1%3aprimaryr6)

**Note:**
You can find more datasets for trying out Azure Machine Learning Designer on [this website](https://machinelearningmastery.com/standard-machine-learning-datasets/) or obviously on [Kaggle](https://www.kaggle.com/) - by the way, the [`Wine Quality Dataset`](../data/winequality-white.csv) also makes a great use case for a nice demo.

**A word of caution:** Always make sure to only use properly formatted `csv` files with Automated Machine Learning. Especially incomplete lines/rows, e.g. missing a few commas, can throw off the service easily.

## Azure Machine Learning Designer
### Setup

In your Machine Learning workspace, navigate to the `Designer` section and select `Easy-to-use prebuilt components`.

To run our pipeline, we need to define a compute target.

1. Next to the pipeline name, select the Gear icon that is in the UI, at the top of the canvas to open the Settings pane.

2. In the Settings pane to the right of the canvas, select 'Select compute target'.

3. If you already have an available compute target, you can select it to run this pipeline.

4. Enter a name for the compute resource.

### Data Preparation
#### Data Loading

There are several sample datasets included in the designer for you to experiment with. For this tutorial, use 'Automobile price data (Raw)'.

1. To the left of the pipeline canvas is a palette of datasets and components. Select Sample datasets to view the available sample datasets.

2. Select the dataset Automobile price data (Raw), and drag it onto the canvas.

![alt text](../images/06-drag-data.gif "Drag and Drop Process")

#### Column Selection

When you train a model, you have to do something about the data that's missing. In this dataset, the normalized-losses column is missing many values, so you'll exclude that column from the model altogether.

1. In the component palette to the left of the canvas, expand the Data Transformation section and find the Select Columns in Dataset component.

2. Drag the Select Columns in Dataset component onto the canvas. Drop the component below the dataset component.

3. Connect the Automobile price data (Raw) dataset to the Select Columns in Dataset component. Drag from the dataset's output port, which is the small circle at the bottom of the dataset on the canvas, to the input port of Select Columns in Dataset, which is the small circle at the top of the component.

4. Select the Select Columns in Dataset component.

5. In the component details pane to the right of the canvas, select Edit column.

6. Expand the Column names drop down next to Include, and select All columns.

7. Select the + to add a new rule.

8. From the drop-down menus, select Exclude and Column names.

9. Enter normalized-losses in the text box.

10. In the lower right, select Save to close the column selector.

![alt text](../images/06-automl-process.png "AutoML Process")

11. Select the Select Columns in Dataset component.

12. In the component details pane to the right of the canvas, select the Comment text box and enter 'Exclude normalized losses'.

#### Clean missing data

Your dataset still has missing values after you remove the normalized-losses column. You can remove the remaining missing data by using the Clean Missing Data component.

1. In the component palette to the left of the canvas, expand the section Data Transformation, and find the Clean Missing Data component.

2. Drag the Clean Missing Data component to the pipeline canvas. Connect it to the Select Columns in Dataset component.

3. Select the Clean Missing Data component.

4. In the component details pane to the right of the canvas, select Edit Column.

5. In the Columns to be cleaned window that appears, expand the drop-down menu next to Include. Select, All columns

6. Select Save

7. In the component details pane to the right of the canvas, select Remove entire row under Cleaning mode.

8. In the component details pane to the right of the canvas, select the Comment box, and enter 'Remove missing value rows'.

Your pipeline should now look something like this:

![alt text](../images/04-automl-process.png "AutoML Process")

### Train a machine learning model

Now that you have the components in place to process the data, you can set up the training components.

Because you want to predict price, which is a number, you can use a regression algorithm. For this example, you use a linear regression model.

#### Split the data

Splitting data is a common task in machine learning. You'll split your data into two separate datasets. One dataset will train the model and the other will test how well the model performed.

1.In the component palette, expand the section Data Transformation and find the Split Data component.

2. Drag the Split Data component to the pipeline canvas.

3. Connect the left port of the Clean Missing Data component to the Split Data component. Be sure that the left output ports of Clean Missing Data connects to Split Data. The left port contains the cleaned data. The right port contains the discarded data.

4. Select the Split Data component.

5. In the component details pane to the right of the canvas, set the Fraction of rows in the first output dataset to 0.7.

6. This option splits 70 percent of the data to train the model and 30 percent for testing it. The 70 percent dataset will be accessible through the left output port. The remaining data will be available through the right output port.

7. In the component details pane to the right of the canvas, select the Comment box, and enter Split the dataset into training set (0.7) and test set (0.3).

#### Train the model

Train the model by giving it a dataset that includes the price. The algorithm constructs a model that explains the relationship between the features and the price as presented by the training data.

1. In the component palette, expand Machine Learning Algorithms. This option displays several categories of components that you can use to initialize learning algorithms.

2. Select Regression > Linear Regression, and drag it to the pipeline canvas.

3. In the component palette, expand the section Module training, and drag the Train Model component to the canvas.

4. Connect the output of the Linear Regression component to the left input of the Train Model component.

5. Connect the training data output (left port) of the Split Data component to the right input of the Train Model component. Be sure that the left output ports of Split Data connects to Train Model. The left port contains the training set. The right port contains the test set.

![alt text](../images/04-automl-process.png "AutoML Process")

6. Select the Train Model component.

7. In the component details pane to the right of the canvas, select Edit column selector.

8. In the Label column dialog box, expand the drop-down menu and select Column names.

9. In the text box, enter price to specify the value that your model is going to predict. Make sure you enter the column name exactly. Do not capitalize price.

Your pipeline should look like this:

![alt text](../images/04-automl-process.png "AutoML Process")




#### Add the Score Model component

After you train your model by using 70 percent of the data, you can use it to score the other 30 percent to see how well your model functions.

Enter score model in the search box to find the Score Model component. Drag the component to the pipeline canvas.

Connect the output of the Train Model component to the left input port of Score Model. Connect the test data output (right port) of the Split Data component to the right input port of Score Model.

#### Add the Evaluate Model component

### Submit the pipeline

#### View scored labels

#### Evaluate models

Use the Evaluate Model to see how well the trained model performed on the test dataset.

1. Right-click the Evaluate Model component and select Preview data > Evaluation results to view its output.

The following statistics are shown for your model:

-Mean Absolute Error (MAE): The average of absolute errors. An error is the difference between the predicted value and the actual value.
-Root Mean Squared Error (RMSE): The square root of the average of squared errors of predictions made on the test dataset.
-Relative Absolute Error: The average of absolute errors relative to the absolute difference between actual values and the average of all actual values.
-Relative Squared Error: The average of squared errors relative to the squared difference between the actual values and the average of all actual values.
-Coefficient of Determination: Also known as the R squared value, this statistical metric indicates how well a model fits the data.

For each of the error statistics, smaller is better. A smaller value indicates that the predictions are closer to the actual values. For the coefficient of determination, the closer its value is to one (1.0), the better the predictions.
### Clean up resources

In the designer where you created your experiment, delete individual assets by selecting them and then selecting the Delete button.

The compute target that you created here automatically autoscales to zero nodes when it's not being used. This action is taken to minimize charges.
![alt text](../images/04-automl-process.png "AutoML Process")

You can unregister datasets from your workspace by selecting each dataset and selecting Unregister.
![alt text](../images/04-automl-process.png "AutoML Process")

To delete a dataset, go to the storage account by using the Azure portal or Azure Storage Explorer and manually delete those assets.







Comments will appear on the graph to help you organize your pipeline
![alt text](../images/04-automl-process.png "AutoML Process")

Give our new dataset a name and select the `pima-indians-diabetes.csv` from **`aidevcollege/day1/AzureMachineLearningService/data`**, and upload it into the Azure Machine Learning User Interface. For this challenge we will use a cleansed version of the data set with headers here:  [`pima-indians-diabetes.csv`](../data/pima-indians-diabetes.csv)

![alt text](../images/04-automl_dataset.png "AutoML Dataset")

Then we can either re-use our previous storage or create a new one (in this case we can just use our existing one):

![alt text](../images/04-automl_datastore_for_dataset.png "AutoML Datastore")

Next we view the settings and preview and select `Use headers from the first file`

![alt text](../images/04_automl_dataset_settings_preview.png "AutoML Dataset Settings")

And we will also see a preview of our data, where we can exclude features and also specify which column we want to include. In this challenge we leave the schema as it is:

![alt text](../images/04_automl_dataset_schema.png "AutoML Dataset Schema")

Lastly we confirm the details:

![alt text](../images/04_automl_confirm_details.png "AutoML Confirm Details")

Then we can name our experiment and we can either re-use our Compute Instance, but we could also create a new `Azure Machine Learning compute` cluster or re-use the cluster from challenge 2. The `Create a new compute` window is self-explanatory after the last challenges (set minimum to `0` and maximum number of nodes to `1`)! 

> To avoid charges when no jobs are running, set the minimum nodes to 0. This setting allows Azure Machine Learning to de-allocate the compute nodes when idle. Any higher value will result in charges for the number of nodes allocated.

![alt text](../images/04-create_compute.png "Create new compute")

or we use our existing one:

![alt text](../images/04-automl_compute.png "Use existing compute")

Lastly we can configure the `Task type and settings` tab. 
Here we make sure we set the job to `Classifcation` and define `diabetes` as the target column.

**Classification**
Classification is a common machine learning task. Classification is a type of supervised learning in which models learn using training data, and apply those learnings to new data. Azure Machine Learning offers featurizations specifically for these tasks, such as deep neural network text featurizers for classification. Learn more about featurization options. The main goal of classification models is to predict which categories new data will fall into based on learnings from its training data. Common classification examples include fraud detection, handwriting recognition, and object detection.

![alt text](../images/04-automl_select_task_type.png "Select task type")

Under **`View additional configuration settings`**, we can further configure our AutoML job and select our optimization metric, concurrency, etc. Let's set **`Training job time (hours)` to `0.5`**. This means our training job will terminate after a maximum of 30 minutes. **The entire AutoML Run can take about 25-30 min**. *Time to grab a coffee or continue to the next challenge and come back later!* ☕

![Exit criteria](../images/04_automl_exit_criteria.png)

Once we start the training, it'll take ~6 minutes to prepare the experiment. Overall, the default 100 iterations would take quite a while, but since we limited the training time to 15 minutes, it'll terminate earlier. Once the job has finished, we should see something like this:

![Final results](../images/04-automl_final_results.png)

Below, we can see the metrics per iteration:

![Metrics per iteration](../images/04-automl_metrics_per_iteration.png)

If we click one of the iterations, we'll get plenty of metrics for the evaluated pipeline:

![Run details](../images/04-automl_run_details.png)

Without doubt, it is important to understand what those metrics actually mean, since this will allow us to judge if the generated model(s) are useful or not. [This link](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-understand-automated-ml) will help you to understand the metrics of Automated Machine Learning.

Next, we can deploy one of the iterations to ACI.

## Model Deployment to ACI

On the details screen for each iteration, we can download the Model's `.pkl` file and also directly deploy it to ACI. Let's deploy one of the models:

![alt text](../images/DeployaModelonACI.png "Deploy model")

In the same screen, we can also download the `yaml` for the Conda environment used, but more importantly, the `score.py` - this helps us to understand, what data we need to input into our API!

We can see how AutoML is first creating an image, and then starts the deployment to a new Azure Container Instance.

Once the deployment has finished (~7 minutes), we can find the scoring URI in our Workspace under `Endpoints --> pima-indian --> Details`:

![alt text](../images/04-automl_deployment_details.png "Deployment details")

 Finally we can score one or more data samples using the following Python code (just run the code in one of the former notebooks and replace the `url` with the REST Endpoint):

```python
import requests
import json

url = 'Replace with your URL'
headers = {'Content-Type':'application/json'}
data = {"Inputs": {
    "data": [{
    "times_pregnant": 6,
    "glucose": 148,
    "blood_pressure": 72,
    "triceps_thickness": 35,
    "insulin": 0,
    "bmi": 33.6,
    "diabetes_pedigree": 0.627,
    "age": 50
},
{
    "times_pregnant": 1,
    "glucose": 85,
    "blood_pressure": 66,
    "triceps_thickness": 29,
    "insulin": 0,
    "bmi": 26.6,
    "diabetes_pedigree": 0.351,
    "age": 31
}]}}

resp = requests.post(url, data=json.dumps(data), headers=headers)
print("Prediction Results:", resp.json())
```

Pretty easy, right?

More details can be found [here](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-portal-experiments#deploy-model). We can obviously relatively easily re-use the code from challenge 3, and just swap out the `score.py` and the `conda.yml` for programmatically deploying the model.

At this point:

* We took the `Pima Indians Diabetes Dataset` and ran automated Automated Machine Learning for classification on it
* We evaluated 25 algorithms and achieved an accuracy of ~77.9% (your accuracy might vary, since it is not necessarily deterministic)
* We took the best performing model and deployed it to ACI (similar to challenge 3)
* If we don't like the model yet, we could start further experimentation by taking the best performing pre-processing & algorithm pipeline and use it as a starting point

So far, we have focused on deploying models to Azure Container Instances, which is great for testing scenarios. For production grade deployments, we want to use Azure Kubernetes Service, which we'll do in the [fifth challenge](challenge_05.md).
