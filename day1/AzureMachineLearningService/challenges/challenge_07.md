

# Challenge 7: Deploy to AKS using Azure Machine Learning Designer

Use the designer to deploy a machine learning model to predict the price of cars. This tutorial is part two of a two-part series.

In **[challenge 6](../challenges/challenge_06.md)** you trained a linear regression model on car prices. In this last challenge, you deploy the model to give others a chance to use it. In this tutorial, you:

* Create a real-time inference pipeline.
* Create an inferencing cluster.
* Deploy the real-time endpoint.
* Test the real-time endpoint.

## Create a real-time inference pipeline

To deploy your pipeline, you must first convert the training pipeline into a real-time inference pipeline. This process removes training components and adds web service inputs and outputs to handle requests.

 'Create inference pipeline' only supports training pipelines which contain only the designer built-in components and must have a component like **Train Model**  which outputs the trained model.

### Create a real-time inference pipeline

1. Open the pipeline job detail page by clicking on *Job Details* on the left pane of the Designer after submitting a pipeline run. Above the pipeline canvas, select **Create inference pipeline** > **Real-time inference pipeline**.

![alt text](../images/07-create-real-time-inference.png "Real Time Inference")

 Your new pipeline will now look like this:

![alt text](../images/07-real-time-inference-pipeline.png "Real Time Inference")

When you select **Create inference pipeline**, several things happen:
    
* The trained model is stored as a **Dataset** component in the component palette. You can find it under **My Datasets**.
* Training components like **Train Model** and **Split Data** are removed.
* The saved trained model is added back into the pipeline.
* **Web Service Input** and **Web Service Output** components are added. These components show where user data enters the pipeline and where data is returned.

By default, the **Web Service Input** will expect the same data schema as the component output data which connects to the same downstream port as it. In this sample, **Web Service Input** and **Automobile price data (Raw)** connect to the same downstream component, hence **Web Service Input** expect the same data schema as **Automobile price data (Raw)** and target variable column `price` is included in the schema.

However, usually When you score the data, you won't know the target variable values. For such case, you can remove the target variable column in the inference pipeline using **Select Columns in Dataset** component. Make sure that the output of **Select Columns in Dataset** removing target variable column is connected to the same port as the output of the **Web Service Input** component.

1. Select **Submit**, and use the same compute target and experiment that you used in part one.

    If this is the first run, it may take up to 20 minutes for your pipeline to finish running. The default compute settings have a minimum node size of 0, which means that the designer must allocate resources after being idle. Repeated pipeline runs will take less time since the compute resources are already allocated. Additionally, the designer uses cached results for each component to further improve efficiency.

1. Go to the real-time inference pipeline job detail by selecting **Job detail** link in the left pane.

1. Select **Deploy** in the job detail page.

    ![alt text](../images/07-deploy-in-job-detail-page.png "Job Detail Page")

## Create an inferencing cluster

In the dialog box that appears, you can select from any existing Azure Kubernetes Service (AKS) clusters to deploy your model to. If you don't have an AKS cluster, use the following steps to create one.

1. Select **Compute** in the dialog box that appears to go to the **Compute** page.

1. On the navigation ribbon, select **Inference Clusters** > **+ New**.

        ![alt text](../images/07-new-inference-cluster.png "New Inference Cluster")
   
1. In the inference cluster pane, configure a new Kubernetes Service.

1. Enter *aks-compute* for the **Compute name**.
    
1. Select a nearby region that's available for the **Region**.

1. Select **Create**.

It takes approximately 15 minutes to create a new AKS service. You can check the provisioning state on the **Inference Clusters** page.

## Deploy the real-time endpoint

After your AKS service has finished provisioning, return to the real-time inferencing pipeline to complete deployment.

1. Select **Deploy** above the canvas.

1. Select **Deploy new real-time endpoint**.

1. Select the AKS cluster you created.
             ![alt text](../images/07-setup-endpoint.png "How to set up a new real-time endpoint")

    You can also change **Advanced** setting for your real-time endpoint.

    |Advanced setting|Description|
    |---|---|
    |Enable Application Insights diagnostics and data collection| Whether to enable Azure Application Insights to collect data from the deployed endpoints. </br> By default: false. |
    |Scoring timeout| A timeout in milliseconds to enforce for scoring calls to the web service.</br>By default: 60000.|
    |Auto scale enabled|   Whether to enable autoscaling for the web service.</br>By default: true.|
    |Min replicas| The minimum number of containers to use when autoscaling this web service.</br>By default: 1.|
    |Max replicas| The maximum number of containers to use when autoscaling this web service.</br> By default: 10.|
    |Target utilization|The target utilization (in percent out of 100) that the autoscaler should attempt to maintain for this web service.</br> By default: 70.|
    |Refresh period|How often (in seconds) the autoscaler attempts to scale this web service.</br> By default: 1.|
    |CPU reserve capacity|The number of CPU cores to allocate for this web service.</br> By default: 0.1.|
    |Memory reserve capacity|The amount of memory (in GB) to allocate for this web service.</br> By default: 0.5.|

1. Select **Deploy**.

    A success notification from the notification center appears after deployment finishes. It might take a few minutes.
 ![alt text](../images/07-deploy-notification.png "Deployment notification")

You can also deploy to **Azure Container Instance** (ACI) if you select **Azure Container Instance** for **Compute type** in the real-time endpoint setting box.
Azure Container Instance is used for testing or development. Use ACI for low-scale CPU-based workloads that require less than 48 GB of RAM.

## Test the real-time endpoint

After deployment finishes, you can view your real-time endpoint by going to the **Endpoints** page.

1. On the **Endpoints** page, select the endpoint you deployed.

    In the **Details** tab, you can see more information such as the REST URI, Swagger definition, status, and tags.

    In the **Consume** tab, you can find sample consumption code, security keys, and set authentication methods.

    In the **Deployment logs** tab, you can find the detailed deployment logs of your real-time endpoint.

1. To test your endpoint, go to the **Test** tab. From here, you can enter test data and select **Test** verify the output of your endpoint.

For more information on consuming your web service, see [Consume a model deployed as a webservice](how-to-consume-web-service.md).

## Update the real-time endpoint

You can update the online endpoint with new model trained in the designer. On the online endpoint detail page, find your previous training pipeline job and inference pipeline job.

1. You can directly find and modify your training pipeline draft in the designer homepage.
    
    Or you can open the training pipeline job link and then clone it into a new pipeline draft to continue editing.
    
 ![alt text](../images/07-endpoint-train-job-link.png "Training job link")

1. After you submit the modified training pipeline, go to the job detail page.

1. When the job completes, right click **Train Model** and select **Register data**.

 ![alt text](../images/07-register-train-model-as-dataset.png "Register trained model")

Input name and select **File** type.

 ![alt text](../images/07-register-train-model-as-dataset-2.png "Register trained model")

1. After the dataset registers successfully, open your inference pipeline draft, or clone the previous inference pipeline job into a new draft. In the inference pipeline draft, replace the previous trained model shown as **MD-XXXX** node connected to the **Score Model** component with the newly registered dataset.

 ![alt text](../images/07-modify-inference-pipeline.png "How to modify inference pipeline")

1. If you need to update the data preprocessing part in your training pipeline, and would like to update that into the inference pipeline, the processing is similar as steps above.

    You just need to register the transformation output of the transformation component as dataset.

    Then manually replace the **TD-** component in inference pipeline with the registered dataset.

      ![alt text](../images/07-replace-td-module.png "How to replace transformation component")

1. After modifying your inference pipeline with the newly trained model or transformation, submit it. When the job is completed, deploy it to the existing online endpoint deployed previously.

      ![alt text](../images/07-deploy-to-existing-endpoint.png "How to replace existing real-time endpoint")

## Limitations

Due to datastore access limitation, if your inference pipeline contains **Import Data** or **Export Data** component, they'll be auto-removed when deploy to real-time endpoint.

## Clean up resources

In the designer where you created your experiment, delete individual assets by selecting them and then selecting the Delete button.

The compute target that you created here automatically autoscales to zero nodes when it's not being used. This action is taken to minimize charges.
![alt text](../images/06-delete-asset.png "Deleting assets")

You can unregister datasets from your workspace by selecting each dataset and selecting Unregister.
![alt text](../images/06-unregister-dataset1225.png "Unregistering Dataset")

To delete a dataset, go to the storage account by using the Azure portal or Azure Storage Explorer and manually delete those assets.

Make sure to stop your `Compute Instance` to avoid charges. You can restart it tomorrow.
