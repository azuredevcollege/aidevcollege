# AI Developer College Day2 - Form Recognizer

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](https://learn.microsoft.com/en-us/azure/applied-ai-services/?view=form-recog-3.0.0) for developers to build intelligent document processing solutions. Form Recognizer applies machine-learning-based optical character recognition (OCR) and document understanding technologies to extract text, tables, structure, and key-value pairs from documents. You can also label and train custom models to automate data extraction from structured, semi-structured, and unstructured documents.

## Focus of Today:

Form recognizer comes with a selection of prebuilt models. It is also possible to build and train your own custom model for your specific needs. In the following challenges you will try out the different options you have when using Form Recognizer.

## Here is what you will learn

- Deploy the service
- Operate the User Interface (Form Recognizer Studio)
- Utilise Form Recognizer's prebuilt models
- Build custom models

## Challenges

1. Create Form Recognizer resource: westeurope, pricing tier free F0
1. Get key and endpoint

### Create Form Recognizer resource

Before we can start using Form Recognizer, we first need to deploy the resource in Azure. We will do this using the Azure CLI.

Copy the following command, add the missing information and paste it into your terminal (or Jupyter notebook).

```bash
az cognitiveservices account create --name 'formrecognizer'-$prefix --resou
rce-group <NAME OF YOUR RESOURCE GROUP> --kind FormRecognizer --sku F0 --location westeurope
```

Now we need to get the key and endpoint of our resource.

```bash
az cognitiveservices account keys list --name 'formrecognizer'-$prefix --resource-group <NAME OF YOUR RESOURCE GROUP> #keys
```

Explain the different models

### Read OCR Model

The [Form Recognizer Read OCR Model](https://learn.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/concept-read?view=form-recog-3.0.0) 

### General Document Model

Explain

### Layout Model

Explain

### Invoice Model 

Perform with SDK

### Receipt Model

Explain

Perform in studio

### Custom Model

Explain

Perform in studio

Now that you have tried a selection of Form Recognizer models, you might be wondering which is the right one for your use case. This [table](https://learn.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/overview?view=form-recog-3.0.0#which-form-recognizer-model-should-i-use) will give you an overview of which model to use.