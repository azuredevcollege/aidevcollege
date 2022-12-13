# Challenge 3: Use GitHub Actions with Azure Machine Learning for MLOps

Get started with [GitHub Actions](https://docs.github.com/en/actions) to train a model on Azure Machine Learning. 

This challenge will teach you how to create a GitHub Actions workflow that builds and deploys a machine learning model to Azure Machine Learning. You'll train a [scikit-learn](https://scikit-learn.org/) linear regression model on the NYC Taxi dataset. 

GitHub Actions uses a workflow YAML (.yml) file in the `/.github/workflows/` path in your repository. This definition contains the various steps and parameters that make up the workflow. These steps include **data preparation, model training, testing and scoring**.

**A similar tutorial based on Azure DevOps can be found** [here](day1/MLOps/MLOps.md).


## Prerequisites

**The following prerequisites are required if you want to clone the repository instead of forking it, but it is not a requirement for this challenge. Forking will create a copy of the repository in a remote location such as GitHub, whereas cloning will create a local copy. You can do this challenge entirely in GitHub.**

Before following the steps in this article, make sure you have the following prerequisites:

* Create an Azure Cloud Shell

  ```
  [Azure Portal]
  -> Click the 'Cloud Shell' symbol close to your login details on the right upper corner.
  ```

  ![example of how to access Cloud Shell via Azure Portal](../../../day2/CognitiveServices/Challenge/images/CloudShell.png)
* To install the Python SDK v2, use the following command:

    ```bash
    pip install azure-ai-ml
    ```

    For more information, see [Install the Python SDK v2 for Azure Machine Learning](/python/api/overview/azure/ai-ml-readme).

* A GitHub account. If you don't have one, sign up for [free](https://github.com/join).  

## Step 1. Get the code

Fork the following repo on GitHub to your own GitHub account: [https://github.com/azure/azureml-examples](https://github.com/azure/azureml-examples)

![Screenshot of how to fork a repository](../images/03-fork-repo.png)

## Step 2. Authenticate with Azure

You'll need to first define how to authenticate with Azure using a [service principal](https://learn.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object).

### Generate deployment credentials

Create a [service principal](https://learn.microsoft.com/en-us/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) with the [az ad sp create-for-rbac](https://learn.microsoft.com/en-us/cli/azure/ad/sp#az-ad-sp-create-for-rbac) command in the [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/). Run this command with [Azure Cloud Shell](https://shell.azure.com/) in the Azure portal.
```bash
az ad sp create-for-rbac --name "myML" --role contributor --scopes /subscriptions/<YOUR-SUBSCRIPTION-ID> --sdk-auth
```
In the example above, replace the `<YOUR-SUBSCRIPTION-ID>` placeholders with your subscription ID. You can find it if you type it it in the search bar of the Azure portal.
![Screenshot of where to find subscription id](../images/03-subscription.png)

The output is a JSON object with the role assignment credentials of your service principal. Copy this JSON object and save it in a notepad for later.
```
 {
    "clientId": "<GUID>",
    "clientSecret": "<GUID>",
    "subscriptionId": "<GUID>",
    "tenantId": "<GUID>",
    (...)
  }
```

### Create secrets

1. In GitHub, go to your forked repository.

1. Select Settings > Secrets > Actions.
!["Screenshot of adding a secret"](../images/03-secret.png)

1. Select New repository secret.

1. Paste the entire JSON output from the Azure CLI command into the secret's value field. Give the secret the name AZUREML_CREDENTIALS.

1. Select Add secret.

## Step 3. Update `setup.sh` to connect to your Azure Machine Learning workspace

You'll need to update the CLI setup file variables to match your workspace. 

1. In your forked repository, go to `azureml-examples/cli/`. 
1. Edit `setup.sh` and update these variables in the file. 
   
    |Variable  | Description  |
    |---------|---------|
    |GROUP     |      Name of resource group    |
    |LOCATION     |    Location of your workspace (example: `westeurope`)    |
    |WORKSPACE     |     Name of Azure ML workspace     | 
1. Commit your changes.
![Screenshot of how to commit a change in GitHub](../images//03-commit-changes.png)

## Step 4. Update `pipeline.yml` with your compute cluster name

You'll use a `pipeline.yml` file to deploy your Azure ML pipeline. This is a machine learning pipeline and not a DevOps pipeline.

1. In your forked repository, go to `azureml-examples/cli/jobs/pipelines/nyc-taxi/pipeline.yml`. 
1. Each time you see `compute: azureml:cpu-cluster`, update the value of `cpu-cluster` with your compute cluster name. For example, if your cluster is named `my-cluster`, your new value would be `azureml:my-cluster`. There are five updates.
1. Commit the changes.

## Step 5: Run your GitHub Actions workflow

Your workflow authenticates with Azure, sets up the Azure Machine Learning CLI, and uses the CLI to train a model in Azure Machine Learning. 

Your workflow file is made up of a trigger section and jobs:

- A trigger starts the workflow in the `on` section. The workflow runs by default on a cron schedule and when a pull request is made from matching branches and paths. Learn more about [events that trigger workflows](https://docs.github.com/actions/using-workflows/events-that-trigger-workflows). 
- In the jobs section of the workflow, you checkout code and log into Azure with your service principal secret.
- The jobs section also includes a setup action that installs and sets up the [Machine Learning CLI (v2)](https://learn.microsoft.com/en-us/azure/machine-learning/concept-v2). Once the CLI is installed, the run job action runs your Azure Machine Learning `pipeline.yml` file to train a model with NYC taxi data.

### Enable your workflow

1. In your forked repository, open `.github/workflows/cli-jobs-pipelines-nyc-taxi-pipeline.yml` and verify that your workflow looks like this. 

    ```yaml
    name: cli-jobs-pipelines-nyc-taxi-pipeline
    on:
      workflow_dispatch:
      schedule:
        - cron: "0 0/4 * * *"
      pull_request:
        branches:
          - main
          - sdk-preview
        paths:
          - cli/jobs/pipelines/nyc-taxi/**
          - .github/workflows/cli-jobs-pipelines-nyc-taxi-pipeline.yml
          - cli/run-pipeline-jobs.sh
          - cli/setup.sh
    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
        - name: check out repo
          uses: actions/checkout@v2
        - name: azure login
          uses: azure/login@v1
          with:
            creds: ${{secrets.AZ_CREDS}}
        - name: setup
          run: bash setup.sh
          working-directory: cli
          continue-on-error: true
        - name: run job
          run: bash -x ../../../run-job.sh pipeline.yml
          working-directory: cli/jobs/pipelines/nyc-taxi
    ```

1. Select **View runs**. 
1. Select **Run workflow** and choose the option to **Run workflow** now. 
    
    ![alt text](../media/how-to-github-actions-machine-learning/github-actions-run-workflow.png "Screenshot of run GitHub Actions workflow.")
    

## Step 6: Verify your workflow run

1. Open your completed workflow run and verify that the build job ran successfully. You'll see a green checkmark next to the job. 
1. Open Azure Machine Learning studio and navigate to the **nyc-taxi-pipeline-example**. Verify that each part of your job (prep, transform, train, predict, score) completed and that you see a green checkmark. 

    ![alt text](../media/how-to-github-actions-machine-learning/github-actions-machine-learning-nyc-taxi-complete.png "Screenshot of successful Machine Learning Studio run.")

   

## Clean up resources

When your resource group and repository are no longer needed, clean up the resources you deployed by deleting the resource group and your GitHub repository. 

## Next steps
Often, we have a simpler data set and want to figure out how we can best classify or predict certain data points - without trying out a lot of Machine Learning algorithms ourselves. Hence, we'll look at Automated Machine Learning in the [fourth challenge](challenge_04.md).
