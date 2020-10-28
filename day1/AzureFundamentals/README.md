# Challenge 1: Cloud Shell

[back](../../README.md)

## Here is what you will learn ##

- Use the 'Cloud Shell' as _'launch point'_ for Powershell or Bash to automate Azure resource creation and configuration.
- Learn it's benefits (vs. using PowerShell on your PC)
  
## Benefits of the Azure Cloud Shell ##
The Azure **Cloud Shell is a shell | console hosted in your browser window**. Ready to **execute commands to create, delete, modify Azure resources in your subscription**.  
While it is also possible to use PowerShell or Bash on your local PC to administer Azure. Using the Cloud Shell brings some advantages compared to using your PC as 'launch point'.  

Using the **Cloud Shell saves you time** as...:  
- **no need to explicitly code the azure logon within the script** - you are already authenticated to Azure via the browser
- **nothing needs to be installed on your PC** 

## Create an Azure Cloud Shell (if you don't have one.)
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

## Playing with the Cloud Shell ##
**Execute your first commands**. Using 'PowerShell' or 'Bash' as environment you can either call:  
**Azure CLI code** snippets, e.g.:
```
az account show
```  
or launch **Azure PowerShell snippets**, like:
```PowerShell
Get-AzSubscription
```