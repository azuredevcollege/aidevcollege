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

## Create Form Recognizer resource

Before we can start using Form Recognizer, we first need to deploy the resource in Azure. We will do this using the Azure CLI.

You will be reusing the same Jupyter notebook as in the previous challenges. Create a new file and name it formrecognizer. Then copy the following command, add the missing information and paste it into a cell of your Jupyter notebook.

```bash
az cognitiveservices account create --name 'formrecognizer'-$prefix --resou
rce-group <NAME OF YOUR RESOURCE GROUP> --kind FormRecognizer --sku F0 --location westeurope
```

Now we need to get the key and endpoint of our resource.

```bash
az cognitiveservices account keys list --name 'formrecognizer'-$prefix --resource-group <NAME OF YOUR RESOURCE GROUP> #keys
```


## Form Recognizer model types

As mentioned before, Form Recognizer has a selection of models you can leverage. In the following, you will get to try out a few of them.

### Read OCR Model

The [Form Recognizer Read OCR Model](https://learn.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/concept-read?view=form-recog-3.0.0) extracts print and handwritten text from PDF documents and scanned images. It detects paragraphs, text lines, words, locations, and languages. The read model is the underlying OCR engine for other Form Recognizer prebuilt models like Layout, General Document, Invoice, Receipt, Identity (ID) document, in addition to custom models.

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