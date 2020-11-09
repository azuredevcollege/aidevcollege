# Azure Fundamentals

[back](../../README.md)

## Here is what you will learn ##

- Core Azure architectural components
- Core Azure services and products
- Azure solutions
- Azure management tools
- Use the 'Cloud Shell' as _'launch point'_ for Powershell or Bash to automate Azure resource creation and configuration.
- Learn it's benefits (vs. using PowerShell on your PC)
- Securing network connectivity in Azure
- Core Azure identity services
- Security tools and features
- Azure governance methodologies
- Monitoring and reporting in Azure
- Privacy, compliance and data protection standards in Azure

## Core Azure Services

### Challenge 1 - First Steps in Azure, create a VM 

Let's deploy our first VM in Azure!

<details><summary>Step by Step Guide - click to open</summary><p>

1. Sign in to the Azure portal at https://portal.azure.com
2. Choose **Create a resource** in the upper left-hand corner of the Azure portal.
3. In the search box above the list of Azure Marketplace resources, search for and select **Windows Server 2016 Datacenter**, then choose **Create**.
4. In the **Basics** tab, under Project details, make sure the correct subscription is selected and then choose to **Create new resource group**. Type myResourceGroup for the name.
5. Under **Instance details**, type **myVM** for the Virtual machine name and choose **West Europe** for your Location. Leave the other defaults.
6. Under the **Administrator account** section, provide a username, such as **azureuser** and a password. The password must be at least 12 characters long and meet the defined complexity requirements.
7. Under **Inbound port** rules, choose **Allow selected ports** and then select **RDP (3389)** and **HTTP (80)** from the drop-down. These are to allow us to connect to the virtual machine using RDP over port 3389 and then to see a web page display over HTTP on port 80.
8. Go to the Management tab and under the **Monitoring** section under **Boot diagnostics** select **Off**
9. Leave the remaining defaults and then select the **Review + create** button at the bottom of the page.
10. Once Validation is passed click the **Create** button. It can take approx three to five minutes to deploy the virtual machine.
11. Once the virtual machine is created, go to the resource group you placed the virtual machine in, and open up the virtual machine, then click the **Connect** button on the virtual machine properties page.

>**Note:** The following directions tell you how to connect to your VM from a Windows computer. On a Mac, you need an RDP client such as this Remote Desktop Client from the Mac App Store and on Linux virtual machine you could connect directly from a bash shell using ssh.

12.  In the **Connect to virtual machine** page, keep the default options to connect by DNS name over port 3389 and click Download RDP File.
13.  Open the downloaded RDP file and click **Connect** when prompted.
14.  In the **Windows Security** window, select **More choices** and then Use a different account. Type the username as **localhost\username**, (you could also type .\azureuser) enter password you created for the virtual machine, and then click **OK**.
15.  You may receive a certificate warning during the sign-in process. Click **Yes** or to create the connection and connect to your deployed VM. You should connect successfully.

>**Congratulations!** You have deployed and connected to a >Windows Server virtual machine in Azure

If you wish and have time you could also make the deployed server a functioning web server and make a web page available publicly, by continuing with the following steps

16. Open up a PowerShell command prompt on the virtual machine, by clicking the **Start** button, typing **PowerShell** right clicking **Windows PowerShell** in the menu and selecting **Run as administrator**
17. Install the **Web-Server** feature in the virtual machine by running the following command in the PowerShell command prompt:

````PowerShell
    Install-WindowsFeature -name Web-Server -IncludeManagementTools 
````

18.  When completed you should see a prompt stating **Success** with a value **True**, among other items in the output. You do not need to restart the virtual machine to complete the installation. Close the RDP connection to the VM.
19.  Back in the portal, select the VM and in the overview pane of the VM, use the **Click to copy** button to the right of the IP address to copy it and paste it into a browser tab.
20.  The default IIS Web Server welcome page will open, and is available to connect to publicly via this IP address, or via the fully qualified domain name.

>**Congratulations!** You have created a web server that can be connected to publicly via this IP address, or via the fully qualified domain name. If you had a web page to host you could deploy those source files to the virtual machine and host them for public access on the deployed virtual machine.
>**Note:** Remember to remove any newly created Azure resources that you no longer use. Removing unused resources ensures you will not incur unexpected costs. Remove unused resources by deleting the Resource Group that the unused resources belong to.
</p></details>



### Challenge 2 - Create a Storage Account

Let's our first storage account in  in Azure ans upload a file

<details><summary>Step by Step Guide - click to open</summary><p>

1. Sign in to the Azure portal at https://portal.azure.com
2. Select All services on the upper left hand side of the Azure Portal. In the **All services** filter box, type **Storage Accounts**. As you begin typing, the list filters based on your input. Select **Storage Accounts**.
3. On the **Storage Accounts** window that appears, if there are no storage accounts present you can select **Create storage account**, or if there are already storage accounts present, this option will nt be present and you can choose the option **+ Add**.
4. Complete the Create storage account blade with the following details:
   - Subscription=< Select your subscription >
   - Resource group=Select **Create new**, enter **strac-rg1**, then select **OK**.
   - Storage account name=< this must be between 3-24 characters in length, can be numbers and lowercase only, and must be unique across Azure >
   - Location=**West Europe**
   - Performance=**Standard**
   - Account kind=Leave the default value **StorageV2 (general purpose v2)**
   - Replication=**Locally redundant storage (LRS)**
   - Access tier (default) **Hot**
5. Select **Review + Create** to review your storage account settings and allow Azure to validate the configuration. Once validated select **Create**.
6. Verify its successful creation by going to the resource group just created and locate the storage account.
7. Open the storage account and scroll in the left menu for the storage account, scroll to the **Blob** service section, select **Blobs** and then select the **+ Container** button.
8. Configure the blob container as below and select **OK** when complete to create the blob container.
Setting Value Name i.e. **blob1** The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character. public access level leave the default value i.e. The default level is **Private (no anonymous access)**
9. The container should be created and available
10. We will upload a block blob to your new container. Select the container to show a list of blobs it contains. Since this container is new, it won't yet contain any blobs
>**Note:** Block blobs consist of blocks of data assembled to make a blob. Most scenarios using Blob storage employ block blobs. Block blobs are ideal for storing text and binary data in the cloud, like files, images, and videos.
11. Create a .txt file on your local machine, named **blob1.txt**, and enter some text into it, such as this is a blob file or something like that.
12. Select the **Upload** button to upload a blob to the container. Browse your local file system to find the file you created in the previous steps to upload as a block blob, Click on the **Advanced** arrow, leave the default values as they are, just note them, and then select **Upload**.
>**Note:** You can upload as many blobs as you like in this way. You'll see that the new blobs are now listed within the container.
13. View the uploaded block blob by right clicking on the blob file that was uploaded and selecting **View/edit blob**
14. You can download a block blob by right clicking on the block blob and selecting **Download**. The blob file opens in a browser and is then downloadable by right clicking on the file and selecting save as

>**Congratulations!** You have created a storage account, created a blob storage container within that storage account, then uploaded a block bob, viewed and edited the block blob in the blob container and then downloaded the block blob.

>**Note:** Remember to remove any newly created Azure resources that you no longer use. Removing unused resources ensures you will not incur unexpected costs. Remove unused resources by deleting the Resource Group that the unused resources belong to.
</p></details>



### Challenge 3 - Create Network in Azure with two VMs 

Let's build our first Virtual Network in Azure

<details><summary>Step by Step Guide - click to open</summary><p>

1. Sign in to the Azure portal at https://portal.azure.com
2. Choose **Create a resource** in the upper left-hand corner of the Azure portal, then select **Networking > Virtual network**
3. In the List select  **virtual network** and in the New virtaul network pane create a network using the following settings and values:

   - Name=**vnet1**
   - Address space=**10.1.0.0/16**
   - Subscription=< Select your subscription >
   - Resource group= Select Create new, enter **vnet1-rg1**, then select OK.
   - Location=**West Europe**
   - Subnet – Name= **subnet1**
   - Subnet Address range=**10.1.0.0/24**
   - Leave the rest of the settings at their default values and select Create.

4. Verify the creation of the virtual network by going to the newly created resource group and viewing the virtual network is present, you can click on the virtual network and view its properties if you wish.
5. Create a virtual machine by going to the the upper-left side of the Azure Portal and selecting **Create a resource > Compute > Windows Server 2016 Datacenter** (see exercise 1 above)
6. In Create a **virtual machine - Basics** tab, enter or select this information:

    - Subscription=< Select your subscription >
    - Resource group=The resource group you created it in the last section, i.e. **vnet1-rg1**
    - Virtual machine name=**vm1**
    - Region=**West Europe**
    - Availability options=Leave the default **No infrastructure redundancy required**
    - Image=Leave the default **Windows Server 2016 Datacenter**
    - Size=Leave the default **Standard DS1 v2**
    - Username=**azureuser**
    - Password=enter a password that meets the complexity requirements.
    - Public inbound ports=Select **Allow selected ports**
    - Selected inbound ports=Select **HTTP, HTTPS, SSH** and **RDP**

7. Select **Next** : **Disks**, leave the default values.
8. Select **Next** : **Networking**, complete the following details

   - Virtual network=Leave the default **vnet1**
   - Subnet=Leave the default **subnet1 (10.1.0.0/24)**
   - Public IP=Leave the default (new) **vm1-ip**
   - NIC network security group=accept the default **Basic**
   - Public inbound ports=Select **Allow selected ports**
   - Select inbound ports=Select **HTTP, HTTPS, SSH** and **RDP**
  
9. Select **Next** : **Management**, accept all the defaut values except for the below settings:

   - Boot diagnostics=accept the default value i.e. **On***
   - Diagnostic storage account=accept the default value i.e. **vnet1rgdiag**

10.  Select **Review + create**. Azure will validate the configuration. When you see that Validation passed, select **Create**. Deployment times can vary but it can generally take between three to six minutes to deploy.
11.  Create a second Virtual machine by repeating steps **5 to 9** above, using the same values above above ensuring the below settings are set:

     - Virtual machine **name=vm2**
     - Public IP=Leave the default (new) **vm2-ip**
     - Diagnostic storage account=Leave the default value i.e. **vnet1rg1diag**

12.  When finished filling in the details, validate the configuration by clicking **Review + create** and once successfully validated click **Create**
13.  When both virtual machine have completed deployment connect to the first virtual machine, **vm1**, by going to the resource group you placed the virtual machine in, **vnet-rg1** and open up the virtual machine, then click the **Connect** button on the virtual machine properties page.

>**Note:** The following directions tell you how to connect to your VM from a Windows computer. On a Mac, you need an RDP client such as this Remote Desktop Client from the Mac App Store and on Linux virtual machine you could connect directly from a bash shell using ssh.

14.  In the **Connect to virtual machine** page, keep the default options to connect by DNS name over port 3389 and click **Download RDP** File.
15.  Open the downloaded RDP file and click **Connect** when prompted.
16.  In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the username as **localhost\username**, (you could also type .\azureuser) enter password you created for the virtual machine, and then click **OK**.
17.  You may receive a certificate warning during the sign-in process. Click **Yes** or to create the connection and connect to your deployed VM. You should connect successfully.
18.  Open up a PowerShell command prompt on the virtual machine, by clicking the **Start** button, typing **PowerShell** right clicking **Windows PowerShell** in the menu and selecting **Run as administrator**
19.  Run the command ping vm2 
You receive an error, saying request timed out. The ping fails, because ping uses the **Internet Control Message Protocol (ICMP)**. By default, ICMP isn't allowed through the Windows firewall.
20. To allow *vm2* to ping *vm1* enter the below command. This command allows ICMP inbound through the Windows firewall:

````PowerShell
New-NetFirewallRule –DisplayName "Allow ICMPv4-In" –Protocol ICMPv4 
````

21.  Connect to *VM2* as has been done for *VM1*, using rdp. i.e. open **vm2** properties and click the **Connect** button to download and then connect vis RDP
22.  Open up a PowerShell command prompt on the virtual machine, *VM2*, and run the command:

````PowerShell
ping vm1
````

You should now be able to *ping the vm1* virtual machine successfully, because ICMP has been configured to be allowed through the Windows firewall on the vm1 virtual machine in an earlier step.

>**Congratulations!** This ping is being done using the virtual network you created and deployed the two virtual machines into. The two virtual machines are communicating over this virtual network that was created.

>**Note:** Remember to remove any newly created Azure resources that you no longer use. Removing unused resources ensures you will not incur unexpected costs. Remove unused resources by deleting the Resource Group that the unused resources belong to.
</p></details>



### Challenge 4 - Create an Azure Cloud Shell

Let's create our first Cloud Shell in Azure

<details><summary>Step by Step Guide - click to open</summary><p>

#### Benefits of the Azure Cloud Shell
The Azure **Cloud Shell is a shell | console hosted in your browser window**. Ready to **execute commands to create, delete, modify Azure resources in your subscription**.  
While it is also possible to use PowerShell or Bash on your local PC to administer Azure. Using the Cloud Shell brings some advantages compared to using your PC as 'launch point'.  

Using the **Cloud Shell saves you time** as...:  
- **no need to explicitly code the azure logon within the script** - you are already authenticated to Azure via the browser
- **nothing needs to be installed on your PC** 

```
[Azure Portal] -> Click the 'Cloud Shell' symbol close to your login details on the right upper corner.
```  
![Cloud Shell](./img/CloudShell.png))  
The **'Cloud Shell' is an in-browser-accessible shell for managing Azure resources**. It already has the required SDKs and tools installed to interact with Azure. You can use either Bash or PowerShell.  
When being asked **choose PowerShell this time**.  
**The first time you use the 'Cloud Shell' you will be asked to setup a storage account** e.g. to store files you have uploaded persistently. [See](https://docs.microsoft.com/en-us/azure/cloud-shell/persisting-shell-storage)  

```
[Azure Portal] -> Click 'Show advanced settings'
```  
![Cloud Shell Storage Account Setup](./img/CloudShell1.png)  

| Name | Value |
|---|---|
| Subscription  |  _your subscription_ |
| Cloud Shell Region  |  e.g. **North Europe** |   
| Resource Group  |  e.g. **rg-cloudshell** |   
| Storage Account  |  **_some unique value_** |   
| File Share  |  **cloudshell**|   

```
[Azure Portal] -> Create storage
```  

#### Playing with the Cloud Shell
**Execute your first commands**. Using 'PowerShell' or 'Bash' as environment you can either call:  
**Azure CLI code** snippets, e.g.:
```
az account show
```  
or launch **Azure PowerShell snippets**, like:
```PowerShell
Get-AzSubscription
```
</p></details>

### Challenge 5 - Azure Key Vault

Let's deploy our first Key Vault and save a first secret

<details><summary>Step by Step Guide - click to open</summary><p>

#### Firstly we will create a vault

1. Sign into the Azure Portal and go to **All services > Security** and then select **Key vaults.**
2. In the **Key vaults** pane click on **Create key vault**.
3. In the **Create key vault** blade, enter the details as below and click **Create**
   - Name: a name for your vault i.e. **akvtest1**
   - Subscription: < your subscription >
   - Resource Group: select Create new and enter a new resource group name i.e. **akvrg**
   - Location: < a Datacenter location near you i.e. **West Europe** >
   - Pricing Tier: **Standard**
   - Access policies: < accept default value i.e. **1 principal selected** >
   - Virtual Network Access: < accept default value i.e. **all networks can access** >
4. Go to the newly created Key vault and verify it is present. You can take a moment to browse through some of the options available within it, primarily under **Settings** and then options concerning **Keys, Secrets, Certificates, Access Policies, Firewalls and virtual networks.***
5. Take note of two values in the key vault
- **Vault Name:** In the example it is **akvtest1**
- **DNS name** (also sometimes referred to as the Vault URI): In this example it is `https://akvtest1.vault.azure.net/`. Applications that use your vault through its REST API must use this URI.
>**Note:** Your Azure account is the only one authorized to perform operations on this new vault. Yo can modify this if you wish in the **Settings > Access policies** section

#### Add a secret to the Key Vault
We will now add a password that could be used by an application.
1. On the Key Vault properties pages select **Secrets**, then select **Generate/Import**.
2. On the **Create a secret** blade enter the below values, leave the other values at their defaults and then click **Create**.
   - **Upload options**: Manual
   - **Name**: ExamplePassword
   - **Value**: hVFkk965BuUv96!
3. Once the secret has been successfully created, on the **Secrets** pane, click on the **ExamplePassword**, and note it has a status of Enabled
4. Double click on the password and in the password pane, note the presence of the Secret Identifier. This is the url value that you can now use with applications. It provides a centrally managed and securely stored password for use with applications.
5. In the same pane click the button **Show Secret Value**, to display the password you specified earlier.
>**Note:** It is also possible to set time limitations on when a password is available for use, using the activation and expiration date settings.

>**Congratulations!** You have created an Azure Key vault and then created a password secret in that key vault, providing a securely stored, centrally managed password for use with applications.

>**Note:** Remember to delete the resources you have just deployed if you are no longer using them to ensure you do not incur costs for running resources. You can delete all deployed resources by deleting the resource group in which they all reside.

</p></details>

### Challenge 6 - Role Based Access Control (RBAC)

Let's create Azure resources that we can manage using Role-Based-Access-Control (RBAC)

<details><summary>Step by Step Guide - click to open</summary><p>

In this exercise task we will create some Azure resources that we can manage using Role-Based-Access-Control (RBAC), then we will view access control at subscription level, then view roles and permissions at resource group level for azure resources, and view individual user and all role assignments. You will then add a new role assignment for the virtual machine contributor role and then remove a role assignment for the resources you deployed.

#### Create Azure resources to manage

Firstly, we will deploy some resources to Azure to provide us with some resources to manage.

1. Sign into the Azure Portal and click on the **Cloud Shell** icon in the top right hand corner
2. The **Cloud Shell** is launched in the bottom of the browser window. 
3. Create a resource group into which we will place our resources by running the following Azure CLI command. You can copy and paste the command from the below directly into the Cloud Shell console, then press **Enter** to run the command. This command will run fine in either **powershell** *or* **bash** console.

```azurecli
az group create `
--name rbacrg `
--location westeurope
```

4. Run the below Azure CLI command to create a virtual machine. Again, you can copy and paste the command from below directly into the Cloud Shell console and press Enter to run it.

```azurecli
az vm create `
--name vmrbac1 `
--resource-group rbacrg `
--image Win2019Datacenter `
--location westeurope `
--admin-username azureuser `
--admin-password Password0134!
```

>**Note:** The command will take 2 to 3 minutes to complete. The command will create a virtual machine and various resources associated with it such as storage, networking and security resources. You can close the Azure Cloud Shell once it is complete.

#### View access control at subscription level

The next thing we need to do, in the context of access control, is to decide where to open the **Access control (IAM)** blade, through which we configure Role-Based-Access-Control (RBAC), and that depends on what resources you want to manage access for. i.e. do you want to manage access for everything in a management group, everything in a subscription, everything in a resource group, or a single resource? The **Access control (IAM)** blade is available at all of these levels and provides the same functionality in each. We will firstly have a look at the **Access control (IAM)** options for a subscription.

1. In the Azure portal, click **All services** and the **Subscriptions**, double click on a subscription from the subscriptions listed and then click on **Access control (IAM)**. See what is possible to configure.

#### View roles and permissions

A role definition is a collection of permissions that you use for role assignments. Azure has over 70 built-in roles for Azure resources. Follow these steps to view the available roles and permissions for the resources we deployed earlier.

1. Go to **Resource groups** and choose *rbacrg* i.e. the resource group you created earlier.
2. Within the **rbacrg** resource group, click on **Access control (IAM)** and then select the **Roles** tab to see a list of all the built-in and custom roles.
    >**Note:** You can see the number of users and groups that are assigned to each role at the current scope.
3. Click on the **Owner** role to see who has been assigned this role and also view the permissions for the role.
    >**Note:** As per the screenshot, there are two users listed who are assigned the Owner role. Your list of users will be different.

#### View individual user and all role assignments for a resource

When managing access, you want to know who has access, what are their permissions, and at what scope. To list access for a user, group, service principal, or managed identity, you view their role assignments.

1. In the resource group you created earlier i.e. **rbacrg** go to **Access control (IAM)** and select the **Check Access** tab
2. In the **Find** boxes enter the below values, to search the directory for for display names, email addresses, or object identifiers. The matching results are displayed below the **Find** boxes
   - Azure AD user, group, or service principal
   - < your own user name> 
    >**Note:** Your results will be different and related to your own user account.
3. Click the matching result to open the **< name > assignments - scope** pane. On this pane, you can see the roles assigned to the selected user and the scope. If there are any deny assignments at this scope or inherited to this scope, they will be listed. We can see the user has the role of **Owner** assigned and can manage everything.
4. Still on the resource group **Access control (IAM)** pane, click the **Role assignments** tab to view all the role assignments at this scope. On the **Role assignments** tab, you can see who has access at this scope. 
    >**Note:** Some of roles present, are listed as **(Inherited)**. This means they are assigned from another scope. Access, in general, is either assigned specifically to this resource, or inherited from an assignment to the parent scope. Your values will be different to those displayed here.

#### Add a role assignment

In RBAC, to grant access, you assign a **Role** to a user, group, service principal, or managed identity. We will assign the a role to a user in the following steps.

1. Open the resource group **Access control (IAM)** and click the **Role assignments** tab, then click **Add** and choose **Add role assignment** to open the **Add role assignment** pane.
    >Note: If you don't have permissions to assign roles, the Add role assignment option will be disabled.
2. In the **Add role assignment** pane fill in the following values, then click Save to assign the role.
   - **Role:** select a Role from the drop down list i.e. *Virtual Machine Contributor*
   - **Assign access to:** Azure AD user, group, or service principal
   - **Select:** < type your own user name, and your user name should appear in the list, then click on a user name to select it >
3. The user is now assigned the specified role at the selected scope.

#### Remove role assignments

In RBAC, to remove access, you remove a role assignment.

1. Open the resource group **Access control (IAM)** and click the **Role assignments** tab, 
2. Scroll down through the list of users until you find the user you just added as a **Virtual Machine Contributor**, click on the user, then select **Remove**
3. In the remove role assignment message that appears, click **Yes**.
    >**Note:** Inherited role assignments cannot be removed. If you need to remove an inherited role assignment, you must do it at the scope where the role assignment was created. In the Scope column, the column where (Inherited) appears, there is a link that takes you to the scope where this role was assigned in this case the subscription, then you can go to the Access control (IAM) blade and remove the role assignment there.

**Congratulations!** You have created some Azure resources that you can manage using Role-Based-Access-Control (RBAC), you have viewed access control at subscription level, and then viewed roles and permissions at resource group level for azure resources, and viewed individual user and all role assignments. You then added a new role assignment for the virtual machine contributor role and finally removed a role assignment for the resources you deployed.

**Note:** Remember to delete the resources you have just deployed if you are no longer using them to ensure you do not incur costs for running resources. You can delete all deployed resources by deleting the resource group in which they all reside.

</p></details>


### Additional information

#### Links:

|Demo|Link|
|----|----|
|Deploy Storage|<https://www.youtube.com/watch?v=Y8hz0oIuWDs>|
|Deploy VM|<https://www.youtube.com/watch?v=rGGfRogOCJQ>|
|Customize the Azure Portal|<https://www.youtube.com/watch?v=rGGfRogOCJQ>|

|Topic|Link|
|-----|----|
|Governance|<https://docs.microsoft.com/de-de/learn/modules/intro-to-governance/>|
|Monitoring|<https://docs.microsoft.com/de-de/learn/modules/design-for-efficiency-and-operations-in-azure/3-use-monitoring-and-analytics-to-gain-operational-insights>|
  
