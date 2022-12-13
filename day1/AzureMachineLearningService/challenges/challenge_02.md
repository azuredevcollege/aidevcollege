# Challenge 2: Model Deployment as an Azure Container Instance

## Deploy the model for real-time inference

Once your model has been registered, you can deploy your machine learning model as an Azure Container Instance in the Azure cloud
.
In this challenge you will learn how to deploy a model so that an application can consume (inference) the model over REST.

### Create deployment configuration

The code cell gets a _curated environment_, which specifies all the dependencies required to host the model (for example, the packages like scikit-learn).

Moreover, you create a _deployment configuration_, which specifies the amount of compute required to host the model. In this case, the compute will have 1CPU and 1GB memory.

To get started with the challenge, go back to your `aidevcollege` folder in your Jupyter notebook and create a new `Python 3.8 - AzureML` file. Give it the name `challenge02.ipnb`.

Copy the following code and paste it into the first cell of your notebook. Then run the cell.

```python
# create environment for the deploy
from azureml.core.environment import Environment
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core.webservice import AciWebservice

# get a curated environment
env = Environment.get(
    workspace=ws, 
    name="AzureML-sklearn-0.24.1-ubuntu18.04-py37-cpu-inference",
    version=1
)
env.inferencing_stack_version='latest'

# create deployment config i.e. compute resources
aciconfig = AciWebservice.deploy_configuration(
    cpu_cores=1,
    memory_gb=1,
    tags={"data": "MNIST", "method": "sklearn"},
    description="Predict MNIST with sklearn",
)
```

### Deploy model

This next code cell deploys the model to Azure Container Instance.


> **The deployment takes approximately 3 minutes to complete.**


```python
%%time
import uuid
from azureml.core.model import InferenceConfig
from azureml.core.environment import Environment
from azureml.core.model import Model

# get the registered model
model = Model(ws, "sklearn_mnist_model")

# create an inference config i.e. the scoring script and environment
inference_config = InferenceConfig(entry_script="score.py", environment=env)

# deploy the service
service_name = "sklearn-mnist-svc-" + str(uuid.uuid4())[:4]
service = Model.deploy(
    workspace=ws,
    name=service_name,
    models=[model],
    inference_config=inference_config,
    deployment_config=aciconfig,
)

service.wait_for_deployment(show_output=True)
```

The scoring script file referenced in the code above can be found in the same folder as this notebook, and has two functions:

1. An `init` function that executes once when the service starts - in this function you normally get the model from the registry and set global variables
1. A `run(data)` function that executes each time a call is made to the service. In this function, you normally format the input data, run a prediction, and output the predicted result.

### View endpoint

Once the model has been successfully deployed, you can view the endpoint by navigating to __Endpoints__ in the left-hand menu in Azure Machine Learning studio. You will be able to see the state of the endpoint (healthy/unhealthy), logs, and consume (how applications can consume the model).

## Test the model service

You can test the model by sending a raw HTTP request to test the web service.


```python
# send raw HTTP request to test the web service.
import requests

# send a random row from the test set to score
random_index = np.random.randint(0, len(X_test) - 1)
input_data = '{"data": [' + str(list(X_test[random_index])) + "]}"

headers = {"Content-Type": "application/json"}

resp = requests.post(service.scoring_uri, input_data, headers=headers)

print("POST to url", service.scoring_uri)
print("label:", y_test[random_index])
print("prediction:", resp.text)
```

## Clean up resources

If you're not going to continue to use this model, delete the Model service using:

```python
# if you want to keep workspace and only delete endpoint (it will incur cost while running)
service.delete()
```

If you want to control cost further, stop the compute instance by selecting the "Stop compute" button next to the **Compute** dropdown.  Then start the compute instance again the next time you need it.

### Delete everything

Use these steps to delete your Azure Machine Learning workspace and all compute resources.

> The resources that you created can be used as prerequisites to other Azure Machine Learning tutorials and how-to articles.

At this point:

* We've trained a Machine Learning model using scikit-learn inside a `Compute Instance` running `Jupyter`
* We achieved `~92%` accuracy (not very good for this data set)
* Azure ML knows about our experiment and our initial run and tracked metrics
* We have registered our initial model as a Azure ML Model in our Workspace

In the [next challenge](challenge_03.md), we'll build an MLOps pipeline and use Github Actions to train and deploy a model automatically.
