# Hints for Challenge 4

By now, we have a good understanding how Azure Machine Learning works. In this  challenge, we'll take a data set and use Automated Machine Learning for testing out different regression algorithms automatically. Automated Machine Learning is currently able to perform `classification`, `regression` and also `forecasting`.

**Note:** As of May 2019, Automated Machine Learning can also [be used directly from the Azure Portal](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-create-portal-experiments). In this challenge, we'll use the Portal, in the next challenge, we'll be using code.

## Dataset

For this challenge, we'll use the `Pima Indians Diabetes` dataset: The Pima Indians Diabetes Dataset involves predicting the onset of diabetes within 5 years in Pima Indians given medical details. Before getting started, have a look at the data set: [`pima-indians-diabetes.csv`](../data/pima-indians-diabetes.csv).

**Note:**
You can find more datasets for trying out AutoML on [this website](https://machinelearningmastery.com/standard-machine-learning-datasets/) or obviously on [Kaggle](https://www.kaggle.com/) - by the way, the `Wine Quality Dataset` also makes for a nice demo.

**A word of caution:** Always make sure to only use properly formatted `csv` files with Automated Machine Learning. Especially incomplete lines/rows, e.g. missing a few commas, can throw off the service easily.

## Automated Machine Learning

In your Machine Learning workspace, navigate to the `Automated ML` section and select `+ New Automated ML run`.

The process includes creating or selecting `a dataset`, `Configuring the run` and `Task type and settings`

![alt text](../images/04-automl-process.png "AutoML Process")

Give our new dataset a name or selecting a existing one. For this challenge we will use a cleansed version the data set with headers here:  [`pima-indians-diabetes.csv`](../data/pima-indians-diabetes.csv)

![alt text](../images/04-automl_dataset.png "AutoML Dataset")

Then we can either re-use our previous storage or create a new one (in this case we can just use our existing one):

![alt text](../images/04-automl_datastore_for_dataset.png "AutoML Datastore")

Next we view the settings and preview and select `Use headers from the first file`

![alt text](../images/04_automl_dataset_settings_preview.png "AutoML Dataset Settings")

And we will also see a preview of our data, where we can exclude features and also specify which column we want to include. In this challenge we leave the schema as it is:

![alt text](../images/04_automl_dataset_schema.png "AutoML Dataset Schema")

Lastly we confirm the details:

![alt text](../images/04_automl_confirm_details.png "AutoML Confirm Details")

Then we can name our experiment and we can either re-use our Compute VM, but we could also create a new `Azure Machine Learning compute` cluster or re-use the cluster from challenge 2. The `Create a new compute` window is self-explanatory after the last challenges (set minimum and maximum number of nodes to `1`)!

![alt text](../images/04-create_compute.png "Create new compute")

or we use our existing one:

![alt text](../images/04-automl_compute.png "Use existing compute")


Lastly we can configure the `Task type and settings` tab:

![alt text](../images/04-automl_select_task_type.png "Select task type")
 
Here we make sure we set the job to `Classifcation` and define `diabetes` as the target column.

Under `View additional configuration settings`, we can further configure our AutoML job and select our optimization metric, concurrency, etc. Let's set `Training job time (minutes)` to `10`. This means our training will terminate after a maximum of 10 minutes.

Once we start the training, it'll take ~6 minutes to prepare the experiment. Overall, the default 100 iterations would take quite a while, but since we limited the training time to 10 minutes, it'll terminate earlier. Once the job has finished, we should see something like this:

![alt text](../images/04-automl_final_results.png "Final results")

Below, we can see the metrics per iteration:

![alt text](../images/04-automl_metrics_per_iteration.png "Metrics per iteration")

If we click one of the iterations, we'll get plenty of metrics for the evaluated pipeline:

![alt text](../images/04-automl_run_details.png "Run details")

Without doubt, it is important to understand what those metrics actually mean, since this will allow us to judge if the generated model(s) are useful or not. [This link](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-understand-automated-ml) will help you understanding the metrics of Automated Machine Learning.

Next, we can deploy one of the iterations to ACI.

## Model Deployment to ACI

On the details screen for each iteration, we can download the Model's `.pkl` file and also directly deploy it to ACI. Let's deploy one of the models:

![alt text](../images/04-automl_deploy.png "Deploy model")

In the same screen, we can also download the `yaml` for the Conda environment used, but more importantly, the `score.py` - this helps us to understand, what data we need to input into our API!

We can see how AutoML is first creating an image, and then starts the deployment to a new Azure Container Instance.

Once the deployment has finished (~7 minutes), we can find the scoring URI in our Workspace under `Deployments --> diabetes-api --> Details`:

![alt text](../images/04-automl_deployment_details.png "Deployment details")

 Finally we can score one or more data samples using the following Python code (just run the code in one of the former notebooks and replace `url`):

```python
import requests
import json

url = 'Replace with your URL'
headers = {'Content-Type':'application/json'}
data = {"data": [{
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
    
}]}

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