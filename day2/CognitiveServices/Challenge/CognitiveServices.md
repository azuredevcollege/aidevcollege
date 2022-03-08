# AI Developer College Day2 - Cognitive Services

As we have looked at Cognitive Search so far and saw how we can enrich our search service with the Azure Cognitive Services, we will now go into detail of some of those services. Yesterday we trained and registered a model and deployed it as an endpoint. Microsoft offers these services for developers to be able to make your applications smarter by enriching them with intelligence.

## Focus of Today:

![Focus of today](./images/Overview.png)

## Here is what you will learn

Today will be an overview of Azure Cognitive Services, as you will learn:

- How to deploy Cognitive Services from the areas *Language*, *Speech*, *Vision* and *Decision*
- How to use those Cognitive Services using Python
- How to train and use custom models (e.g. Custom Vision) yourself

Thus we will cover the following topics in several sections:

|Topic|Section|
|---|---|
|Text Analytics |[Azure Cognitive Services - Text Analytics](#azure-cognitive-services---text-analytics)|
|Translate Text|[Azure Cognitive Services - Translate Text](#azure-cognitive-services---translate-text)|
|Face|[Azure Cognitive Services - Face](#azure-cognitive-services---face)|
|Computer Vision|[Azure Cognitive Services - Computer Vision Service](#azure-cognitive-services---computer-vision-service)|
|Custom Vision|[Azure Cognitive Services - Custom Vision Service for Detecting Objects in Images](#azure-cognitive-services---custom-vision-service-for-detecting-objects-in-images)|
|Speech|[Azure Cognitive Services - Speech](#azure-cognitive-services---speech)|
|Language|[Azure Cognitive Services - Language - Reveal the intention of the text](#azure-cognitive-services---language---reveal-the-intention-of-the-text)|

# Azure Cognitive Services

## What are Azure Cognitive Services?

Azure Cognitive Services: 
- are APIs, SDKs and services available to help developers build intelligent applications without having direct Artificial Intelligence (AI), Machine Learning expert skills. 
- enable developers to easily add cognitive features into their applications. 
- help developers create applications that can see, hear, speak, understand and even begin to reason. 
- The catalcan be categorized into five main pillars - *Language*, *Speech*, *Vision* and *Decision*.

If you are interested to read more about each service, we have added a list of valuable links in the **`Details`** section below.

<details>
We'll touch on the following services:

|Service|Where?|
|---|---|
|Text Analytics|[Text Analytics API](https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/)|
|Translate Text|[Translate Text](https://docs.microsoft.com/en-us/azure/cognitive-services/Translator/translator-info-overview)|
|Face Recognition|[Face API](https://docs.microsoft.com/en-us/azure/cognitive-services/Face/overview)|
|Computer Vision|[Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/)|
|Custom Vision|[Custom Vision API](https://docs.microsoft.com/en-us/azure/cognitive-services/Custom-Vision-Service/overview)|
|Speech|[Speech Services](https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/)|

</details>

You can solve these tasks in a programming language of your choice. For sake of convenience, we are providing hints in `Python`, which you can easily run on the `Compute Instance (VM) from the Azure Machine Learning Service` or in `Visual Studio Code`. SDK Support for `C#`, `Node.js` or `.NET Core` is available for most challenges. You can find code examples in the Azure documentation for the associated services.

For this entire challenge we can create a `Resource Group` called `CognitiveServices` as previously shown and described in the **Azure Portal**. All Cognitive Services can be `added` and deployed in this Resource Group.

In the upcoming tasks, we will reuse the `Compute Instance (VM)` from the __Azure Machine Learning Service__ and create a new Notebook. We can click the `New` button and create a new Notebook of type: `Python 3.6 - AzureML`. A new browser tab should open up and we can click the name `Untitled` and rename it to `CognitiveServices.ipynb`.

Let's look at the first pillar of Cognitive Services - Language.

# Language

The world is getting more and more connected and therefore, translation services are gaining more significance. The **Azure Translator Cognitive Service** is a cloud-based machine translation service. It is easy to integrate into your applications, websites, tools, and solutions. It allows you to add multi-language user experiences in various [languages](https://docs.microsoft.com/en-us/azure/cognitive-services/Translator/language-support) and can be used on any hardware platform with any operating system for text translation.

## Translator

:triangular_flag_on_post: **Goal:** Translation of multiple sentences, detection of one or more input languages to one or several output languages concurrently.

Let's get started with using the translator service!

First, create a `Translator` API Key in the Azure Portal:

![Translator Text API](./images/New_CreateTranslator.PNG)

![Translator Text API Details](./images/TTCreateDetails.png)

The Translator API allows to directly access the service by specifying the API key. As with other services, you can find the key under "Keys and Endpoint".

Use the `CognitiveServices.ipynb` Notebook which you just created and copy the following code in a cell. Again, we will conduct a REST Call by sending data to the *Translate Cognitive Service* and receiving a response from the pre-trained Machine Learning model behind the scenes. In this case, we are translating text from English to German.

```python
import requests, uuid, json

subscription_key = "YOUR_SUBSCRIPTION_KEY"
location = "YOUR_RESOURCE_LOCATION"
endpoint = "https://api.cognitive.microsofttranslator.com"
path = '/translate'
url = endpoint + path

headers = {
  'Ocp-Apim-Subscription-Key': subscription_key,
  'Ocp-Apim-Subscription-Region': location,
  'Content-type': 'application/json',
  'X-ClientTraceId': str(uuid.uuid4())
}

params = {
  'api-version': '3.0',
  'from': 'en',
  'to': ['de', 'it']
}

body = [
  {'text' : 'I want to order 4 pizza Magarita and 8 beer!'},
  {'text' : 'Please add 42 salads to the order!'}
]

response = requests.post(url, headers=headers, params=params, json=body)
print(json.dumps(response.json(), indent=2))
```
Example Result: 

```json
[
  {
    "translations": [
      {
        "text": "Ich m\u00f6chte 4 Pizza Magarita und 8 Bier bestellen!",
        "to": "de"
      },
      {
        "text": "Voglio ordinare 4 pizza Magarita e 8 birre!",
        "to": "it"
      }
    ]
  },
  {
    "translations": [
      {
        "text": "Bitte f\u00fcgen Sie der Bestellung 42 Salate hinzu!",
        "to": "de"
      },
      {
        "text": "Si prega di aggiungere 42 insalate all'ordine!",
        "to": "it"
      }
    ]
  }
]
```

As we can see, we can translate multiple sentences to multiple languages within one API call. The service also automatically detects the input language. (*Optional*: Try deleting the 'from': 'en' from the params section of the code and see how the json response changes.) It is possible to add optional parameters such as a profanity filter and more.

The Translator Service does not only translate text, but also has the capability of transliterating text from one type of script to another (and much more). You can try it out with the code below:

```python
path = '/transliterate'
url = endpoint + path

params = {
    'api-version': '3.0',
    'language': 'ja',
    'fromScript': 'jpan',
    'toScript': 'latn'
}

body = [
  {'text' : 'こんにちは'}
]

response = requests.post(url, headers=headers, params=params, json=body)
print(json.dumps(response.json(), indent=2))
```

This should be the result:
```json
[
  {
    "text": "Kon'nichiwa",
    "script": "latn"
  }
]
```

**Optional**:

Now let's continue with some of the remaining **Cognitive Services for Language**. They are deployed using one service called *Language Service*. It provides Natural Language Processing (NLP) features for understanding and analyzing text.

## Language Service

|Azure Cognitive Services|Information|
|---|---|
|[Cognitive Service for Language](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/overview)|https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/overview|

:triangular_flag_on_post: **Goal:** Leverage Text Analytics API for extracting language, sentiment, key phrases, and entities from text

First we deploy the **Language** service in the **Azure Portal**:

![Azure Portal](./images/CreateLanguageService.png)

By default, the service comes with several pre-built capabilities like sentiment analysis, key phrase extraction or question answering. It is possible to add customizable features. However, for this exercise we will stick with the pre-built capabilities:

![Azure Portal](./images/CreateLanguageService2.png)

Fill in the *name*, agree to the *Legal Terms* and *terms of Responsible AI* and hit *create*:

![Azure Portal](./images/CreateLanguageService3.png)

Get the key and the endpoint under the section *keys* from the Azure portal:

![Azure Portal: Key and URL](./images/keyendpoint.png)

Let's start with connecting to your Language service by copying the code with the **filled in key and endpoint** as shown above into a new cell in your `CognitiveServices.ipynb` notebook:

```python
import requests
from pprint import pprint

subscription_key = "YOUR_SUBSCRIPTION_KEY"
endpoint = "YOUR_ENDPOINT" # Paste your URL in here
headers = {"Ocp-Apim-Subscription-Key": subscription_key}
```

Azure Cognitive Service for Language provides several features. In the following, we will try out only a few of the available features:
- Language Detection ([documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/language-detection/overview))
- Sentiment Analysis ([documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/sentiment-opinion-mining/overview))
- Key Phrase Extraction ([documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/key-phrase-extraction/overview))
- Entity Linking ([documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/language-service/entity-linking/overview))


In general, we will conduct [REST](https://restfulapi.net/) Calls to the Cognitive Service by sending some data to the service and letting the **pre-trained Machine Learning Model** behind the scenes give responses in [JSON format](https://www.w3schools.com/whatis/whatis_json.asp) regarding the data.

For each of the following features, copy the code blocks into new cells of your Jupyter Notebook.

### Language Detection

Firstly, we can extract the language from text. Run this in a new Cell in your `CognitiveServices.ipynb` notebook:

```python
language_detection_api_url = endpoint + "text/analytics/v3.1/languages"

documents = { "documents": [
    { "id": "1", "text": "This is a document written in English." },
    { "id": "2", "text": "Este es un document escrito en Español." },
    { "id": "3", "text": "这是一个用中文写的文件" }
]}

response  = requests.post(language_detection_api_url, headers=headers, json=documents)
languages = response.json()
pprint(languages)
```

Your result should look like this:

```json
{'documents': [{'detectedLanguage': {'confidenceScore': 1.0,
                                     'iso6391Name': 'en',
                                     'name': 'English'},
                'id': '1',
                'warnings': []},
               {'detectedLanguage': {'confidenceScore': 0.75,
                                     'iso6391Name': 'es',
                                     'name': 'Spanish'},
                'id': '2',
                'warnings': []},
               {'detectedLanguage': {'confidenceScore': 1.0,
                                     'iso6391Name': 'zh_chs',
                                     'name': 'Chinese_Simplified'},
                'id': '3',
                'warnings': []}],
 'errors': [],
 'modelVersion': '2021-11-20'}
```

### Sentiment Analysis

Secondly, we can analyse the sentiment of a given phrase. Go ahead and copy the code into your `CognitiveServices.ipynb` notebook:

```python
sentiment_api_url = endpoint + "text/analytics/v3.2-preview.1/sentiment"

documents = {"documents" : [
  {"id": "1", "language": "en", "text": "I had a wonderful experience! The rooms were wonderful and the staff was helpful."},
  {"id": "2", "language": "en", "text": "I had not a great time at the hotel. The staff was rude and the food was awful."},  
  {"id": "3", "language": "es", "text": "Los caminos que llevan hasta Monte Rainier son espectaculares y hermosos."},  
  {"id": "4", "language": "es", "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."}
]}

response  = requests.post(sentiment_api_url, headers=headers, json=documents)
sentiments = response.json()
pprint(sentiments)
```

Your result should look like this:

```json
{'documents': [{'confidenceScores': {'negative': 0.0,
                                     'neutral': 0.0,
                                     'positive': 1.0},
                'id': '1',
                'sentences': [{'confidenceScores': {'negative': 0.0,
                                                    'neutral': 0.0,
                                                    'positive': 1.0},
                               'length': 29,
                               'offset': 0,
                               'sentiment': 'positive',
                               'text': 'I had a wonderful experience!'},
                              {'confidenceScores': {'negative': 0.0,
                                                    'neutral': 0.0,
                                                    'positive': 1.0},
                               'length': 51,
                               'offset': 30,
                               'sentiment': 'positive',
                               'text': 'The rooms were wonderful and the staff '
                                       'was helpful.'}],
                'sentiment': 'positive',
                'warnings': []},
               {'confidenceScores': {'negative': 1.0,
                                     'neutral': 0.0,
                                     'positive': 0.0},
```

### Key Phrase Extraction

Thirdly, we can extract key phrases from text. In order to do so, copy the following code into your `CognitiveServices.ipynb` notebook:

```python
keyphrase_url = endpoint + "text/analytics/v3.1/keyphrases"

documents = {"documents" : [
  {"id": "1", "language": "en", "text": "I had a wonderful experience! The rooms were wonderful and the staff was helpful."},
  {"id": "2", "language": "en", "text": "I had a terrible time at the hotel. The staff was rude and the food was awful."},  
  {"id": "3", "language": "es", "text": "Los caminos que llevan hasta Monte Rainier son espectaculares y hermosos."},  
  {"id": "4", "language": "es", "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."}
]}

response  = requests.post(keyphrase_url, headers=headers, json=documents)
key_phrases = response.json()
pprint(key_phrases)
```
Example Result: 

```json
{'documents': [{'id': '1',
                'keyPhrases': ['wonderful experience', 'rooms', 'staff'],
                'warnings': []},
               {'id': '2',
                'keyPhrases': ['terrible time', 'hotel', 'staff', 'food'],
                'warnings': []},
               {'id': '3',
                'keyPhrases': ['Monte Rainier', 'caminos'],
                'warnings': []},
               {'id': '4',
                'keyPhrases': ['mucho tráfico', 'día', 'carretera', 'ayer'],
                'warnings': []}],
 'errors': [],
 'modelVersion': '2021-06-01'}
```

### Entity Linking

And last but not least, we can detect and link entities in text. Entity linking identifies and disambiguates the identity of entities found in text. For example, in the sentence "We went to Seattle last week.", the word "Seattle" would be identified, with a link to more information on Wikipedia. In order to try it out, copy the code into your `CognitiveServices.ipynb` notebook:

```python
entities_url = endpoint + "/text/analytics/v3.1/entities/linking"

documents = {"documents" : [
  {"id": "1", "text": "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800."}
]}

response  = requests.post(entities_url, headers=headers, json=documents)
entities = response.json()
pprint(entities)
```
Example result: 

```json
{'documents': [{'entities': [{'bingId': 'a093e9b9-90f5-a3d5-c4b8-5855e1b01f85',
                              'dataSource': 'Wikipedia',
                              'id': 'Microsoft',
                              'language': 'en',
                              'matches': [{'confidenceScore': 0.51,
                                           'length': 9,
                                           'offset': 0,
                                           'text': 'Microsoft'}],
                              'name': 'Microsoft',
                              'url': 'https://en.wikipedia.org/wiki/Microsoft'},
                             {'bingId': '0d47c987-0042-5576-15e8-97af601614fa',
                              'dataSource': 'Wikipedia',
                              'id': 'Bill Gates',
                              'language': 'en',
                              'matches': [{'confidenceScore': 0.56,
                                           'length': 10,
                                           'offset': 25,
                                           'text': 'Bill Gates'}],
                              'name': 'Bill Gates',
                              'url': 'https://en.wikipedia.org/wiki/Bill_Gates'},
                             {'bingId': 'df2c4376-9923-6a54-893f-2ee5a5badbc7',
                              'dataSource': 'Wikipedia',
                              'id': 'Paul Allen',
                              'language': 'en',
                              'matches': [{'confidenceScore': 0.56,
                                           'length': 10,
                                           'offset': 40,
                                           'text': 'Paul Allen'}]
```

If you want to directly create a dashboard within Power BI from the derived results, have a look at [this tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/tutorials/tutorial-power-bi-key-phrases).

### Optional: Language Studio

[Language Studio](https://aka.ms/languageStudio) is a set of UI-based tools that lets you explore, build, and integrate features from Azure Cognitive Service for Language into your applications. Using the Studio, you can get started without needing to write code, and then use the available client libraries and REST APIs in your application.

Each of the features of the Cognitive Service for Language has a demo-like experience inside Language Studio that lets you input text, and presents the response both visually, and in JSON. These demos help you quickly test these prebuilt features without using code.

Since we looked at *Entity Linking* in the last paragraph, let's check out the Studio's capabilities for this feature.

1. Go to the [Language Studio](https://aka.ms/languageStudio)
2. Log in using your Azure account.
3. A window will pop up prompting you to choose a language resource. Choose the one you created previously.
4. Choose the feature *Find linked entities*.
5. Paste the same text as before (Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800.) into the box and hit *Run*.
6. Examine the results.

Feel free to try out the Language Studio for some of the other features.

So far, we have covered the Language pillar of the Cognitive Services such as Translation. In a next step, we will look at the pillar *Speech*.

# Speech

|Azure Cognitive Services|Information|
|---|---|
|[Speech API](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/)|https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/

:triangular_flag_on_post: **Goal:** Leverage Speech-to-Text and Text-to-Speech

In this section, you will learn about the benefits and capabilities of the **Text-to-speech Cognitive Service**, which enables your applications, tools, or devices to convert text into human-like synthesized speech and the **Speech-to-text Cognitive Service** which enables your application, tools, or devices to convert real-time transcription of audio streams into text. These are two among many more capabilities of the Speech service.

In the language of your choice write two small scripts or apps that:

1. Convert written text into speech (German or English)
1. Convert speech into written text (German or English)

This time, we will use the Python SDK for using the service.

You can use can use this file: [`data/test.wav`](data/test.wav) (English).

First, we need to deploy a Speech service:

![alt text](./images/speech_api_service.png "Speech API Service")

Fill in a *unique name* and select *create*:

![Azure Portal](./images/CreateSpeech.png)

You can find your API key under the service, then `Keys`.

You can use this file [`test.wav`](../data/test.wav) for testing.

## Text-to-Speech

To use any SDK, you need to first install it. In this case we will install the Python Speech SDK. Paste the following code in your jupyter notebook:

```python
pip install azure-cognitiveservices-speech
```

If you are using a Mac, you might need to run this first:

```python
python3 -m pip install --upgrade pip
```

Once the SDK is installed, we can write our code. Firstly, create a speech configuration instance and import the necessary libraries. Next, define the [language and voice](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#prebuilt-neural-voices). We have already selected them for your. Feel free to change them up a little. Then creates an `AudioOutputConfig` instance, which writes the audio output to a .wav file. Furthermore, execute the speech synthesis and writing to the .wav file. Lastly, display the audio output.

```python
import azure.cognitiveservices.speech as speechsdk # import the speech sdk
import IPython.display as ipd # import IPython.display to display the audio output

def to_file():
  speech_config = speechsdk.SpeechConfig(subscription="YOUR_SUBSCRIPTION_KEY", region="YOUR_RESOURCE_LOCATION")
  speech_config.speech_synthesis_language = "en-US"
  speech_config.speech_synthesis_voice_name ="en-GB-SoniaNeural"
  audio_config = speechsdk.audio.AudioOutputConfig(filename="welcome.wav")
  synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
  synthesizer.speak_text_async("Hello, welcome to the AI Developer College!")

to_file()

ipd.Audio('welcome.wav')
```

As mentioned earlier, there are [many different voices](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support#text-to-speech) available to choose from. By updating `speech_config.speech_synthesis_voice_name` and `speech_config.speech_synthesis_voice_name` we can easily specify a different language or voice. From here on, it should be easy to generate German speech. Try it out!

## Speech-to-Text

Let's take the generated or provided `welcome.wav` from the example before and convert it back to text.

Paste the following code in the notebooke you used before.

```python
def from_file():
    audio_input = speechsdk.AudioConfig(filename="welcome.wav")
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_input)
    result = speech_recognizer.recognize_once_async().get()
    print(result.text)

from_file()
```

For recognizing longer text with multiple sentences, you can follow the [following tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/quickstart-python).

***Note:***

Compressed audio is also supported (e.g., MP3s), see [here](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-use-codec-compressed-audio-input-streams),

Besides that, the speech-to-text API expects audio with the following specifics:
* 16-bit WAV format with PCM or OGG format with OPUS
* Single channel (mono) at 8 or 16 KHz

More details, see [here](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-use-audio-input-streams).

## Optional: Speech Studio

[Speech Studio](https://speech.microsoft.com/portal) is a set of UI-based tools for building and integrating features from Azure Cognitive Services Speech service in your applications. You create projects in Speech Studio by using a no-code approach, and then reference those assets in your applications by using the Speech SDK, the Speech CLI, or the REST APIs. This is especially useful if you want to run quick tests.

Try performing text-to-speech and speech-to-text with the Speech Studio.

1. Go to the [Speech Studio](https://speech.microsoft.com/portal)
2. Click on **Real-time Speech-to-text**
- Try out the different features
3. Click on **Audio Content Creation**
- Create a new text file or upload one
- Try out different voices
- Export the audio file

So far we have focused on the two pillars *Language* and *Speech*. Now we want to jump to the pillar *Vision* by analysing images.

# Vision

 Since more and more apps recognize faces, there is also a **Face Cognitive Service** for that. The Azure Face service provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as security, natural user interface, image content analysis and management, mobile apps, and robotics.

## Face

|Azure Cognitive Services|Information|
|---|---|
|[Face API](https://docs.microsoft.com/en-us/azure/cognitive-services/face/)|https://docs.microsoft.com/en-us/azure/cognitive-services/face/

:triangular_flag_on_post: **Goal:** Detect, identify, and analyze faces in images.

This time we will conduct a REST Call and send an image of a face to the Face Cognitive Service and get a JSON response in return which explains the found characteristics of a face e.g. `faceAttributes`.

1. Deploy a Face API Service in the Portal

![Deploy Face API](./images/New_CreateFace.PNG)

![Details of Deploy Face API](./images/deployfacedetails.png)

To use **Face API**, perform the following steps:

2. Copy code below into a new cell into the `CognitiveServices.ipynb` Notebook.
3. Make the following changes in code where needed:
    1. Replace the value of `api_key` with your api key.
    2. Edit the value of `face_api_url` to include the endpoint URL for your Face API resource.
    3. Optionally, replace the value of `image_url` with the URL of a different image that you want to analyze.
4. Run the Cell and examine the response.

```python
import requests
import json

# set to your own api key value
subscription_key = "YOUR_SUBSCRIPTION_KEY"
endpoint = "YOUR_RESOURCE_ENDPOINT"

face_api_url = endpoint + 'face/v1.0/detect'

image_url = 'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg'

headers = {'Ocp-Apim-Subscription-Key': subscription_key}

params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
}

response = requests.post(face_api_url, params=params,
                         headers=headers, json={"url": image_url})
print(json.dumps(response.json(), indent = 2))
```

### Examine the response

A successful response is returned in JSON (snippet):

```json
[
  {
    "faceId": "e93e0db1-036e-4819-b5b6-4f39e0f73509",
    "faceRectangle": {
      "top": 621,
      "left": 616,
      "width": 195,
      "height": 195
    },
    "faceAttributes": {
      "smile": 0,
      "headPose": {
        "pitch": 0,
        "roll": 6.8,
        "yaw": 3.7
      },
      "gender": "male",
      "age": 37,
      "facialHair": {
        "moustache": 0.4,
        "beard": 0.4,
        "sideburns": 0.1
      },
      "glasses": "NoGlasses",
      "emotion": {
        "anger": 0,
        "contempt": 0,
        "disgust": 0,
        "fear": 0,
        "happiness": 0,
        "neutral": 0.999,
        "sadness": 0.001,
        "surprise": 0
      }
```

As you can see in the image yourself and from the JSON-response, the image shows a male 37-year old with a moustache. He is not wearing glasses and shows a neutral emotion. The image also shows a 56-year old female person without glasses.

As we have already started to investigate images, we will now look at a different service the **Computer Vision Cognitive Service** to analyze text on an image.

Azure's Computer Vision API includes Optical Character Recognition (OCR) capabilities that extract printed or handwritten text from images. You can extract text from images, such as photos of license plates or containers with serial numbers, as well as from documents - invoices, bills, financial reports, articles, and more.

## Computer Vision

|Azure Cognitive Services|Information|
|---|---|
|[Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision)|https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/home

In the language of your choice (Python solution is provided), write two small scripts that

1. Convert hand-written text from an image into text - Test data: [1](https://bootcamps.blob.core.windows.net/ml-test-images/ocr_handwritten_1.jpg), [2](https://bootcamps.blob.core.windows.net/ml-test-images/ocr_handwritten_2.jpg)
1. Convert printed text from an image into text - Test data: [1](https://bootcamps.blob.core.windows.net/ml-test-images/ocr_printed_1.jpg), [2](https://bootcamps.blob.core.windows.net/ml-test-images/ocr_printed_2.jpg)

Once again we will conduct REST Calls to the Computer Vision Cognitive Service and get a JSON in response.

The Computer Vision API offers several services for processing images:
- Optical Character Recognition (OCR)
- Image Analysis
- Spatial Analysis

 In this section, we will concentrate on the service's OCR capabilities. It can extract information from printed text (in several languages), handwritten text (English only + Chinese, French, German and Italian in preview), digits, and currency symbols from images and multi-page PDF documents. It's optimized to extract text from text-heavy images and multi-page PDF documents with mixed languages. It supports detecting both printed and handwritten text in the same image or document. You can get more details [here](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text#:~:text=%20Optical%20Character%20Recognition%20%28OCR%29%20%201%20Read,PDF%20document%20as%20the%20input%20and...%20More%20).

### Optical Character Recognition - Images to Text - Handwritten content

:triangular_flag_on_post: **Goal:** Leverage OCR to make a hand-written text document in images machine-readable

First, create a `Computer Vision` API Key in the Azure Portal

![Create Computer Vision](./images/ComputerVisionCreate.png)

![Create Computer Vision Details](./images/ComputerVisionCreateDetails.png)

As we're dealing with images, we need a few Python packages to help with this. Go ahead and copy the code into a new Cell in your `CognitiveServices.ipynb` Notebook.

```python
import requests, json, time
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from matplotlib.patches import Polygon
from PIL import Image
from io import BytesIO
```

Ok, now we can start recognizing some text. With the Computer Vision API, this is a two-step process:

1. Submit the image (Post-request)
1. Query if the image has been processed (Get-request)

```python
subscription_key = "YOUR_SUBSCRIPTION_KEY"
location = "YOUR_RESOURCE_REGION"

url = "https://" + location + ".api.cognitive.microsoft.com/vision/v3.2/read/analyze"
image_url = "https://bootcamps.blob.core.windows.net/ml-test-images/ocr_handwritten_1.jpg"

headers = {'Ocp-Apim-Subscription-Key': subscription_key, 'Content-type': 'application/json'}
data    = {'url': image_url}

# Post image URL to the API
response = requests.post(url, headers=headers, json=data)

# Return query URL for getting the status
operation_url = response.headers["Operation-Location"]

# Poll until we get a result (...or something failed)
recognition = {}
poll = True
while (poll):
    response_final = requests.get(operation_url, headers=headers)
    recognition = response_final.json()
    time.sleep(1)
    if ("analyzeResult" in recognition):
        poll = False 
    if ("status" in recognition and recognition['status'] == 'failed'):
        poll = False

print(json.dumps(recognition, indent=2))
```

The result should look like this (just a snippet):

```json
{
  "status": "succeeded",
  "createdDateTime": "2022-02-22T10:47:47Z",
  "lastUpdatedDateTime": "2022-02-22T10:47:48Z",
  "analyzeResult": {
    "version": "3.2.0",
    "modelVersion": "2021-04-12",
    "readResults": [
      {
        "page": 1,
        "angle": 4.7589,
        "width": 1000,
        "height": 978,
        "unit": "pixel",
        "lines": [
          {
            "boundingBox": [
              272,
              260,
              858,
              286,
              856,
              389,
              266,
              366
            ],
            "text": "Shopping list :",
            "appearance": {
              "style": {
                "name": "handwriting",
                "confidence": 0.785
              }
            },
            "words": [
              {
                "boundingBox": [
                  279,
                  260,
                  653,
                  284,
                  649,
                  389,
                  267,
                  348
                ],
                "text": "Shopping",
                "confidence": 0.994
              },
              {
                "boundingBox": [
                  676,
                  285,
                  803,
                  286,
                  803,
                  388,
                  673,
                  389
                ],
                "text": "list",
                "confidence": 0.92
              }
```

Ok, looks like it recognized something. Let's visualize it:

```python
polygons = []

# Get bounding boxes of the text 
if ("analyzeResult" in recognition):
    analyzeResult = recognition["analyzeResult"]
    readResults = analyzeResult["readResults"]
   # print(json.dumps(r, indent=2))
    for line in readResults[0]["lines"]:
        polygons += [(line["boundingBox"], line["text"])]
        
# Display image and overlay text
plt.figure(figsize=(15, 15))
image = Image.open(BytesIO(requests.get(image_url).content))
ax = plt.imshow(image)
for polygon in polygons:
    vertices = [(polygon[0][i], polygon[0][i+1])
        for i in range(0, len(polygon[0]), 2)]
    text = polygon[1]
    patch = Polygon(vertices, closed=True, fill=False, linewidth=2, color='y')
    ax.axes.add_patch(patch)
    plt.text(vertices[0][0], vertices[0][1], text, fontsize=20, va="top")
_ = plt.axis("off")
```

**Visualization:**

![Result](./images/ComputerVisionBoxes.png)

**Here is another image we can test with:**

> [Calender Motto Test Image](https://bootcamps.blob.core.windows.net/ml-test-images/ocr_handwritten_2.jpg)

In a next step, we will use the same service by just extracting text from printed text in images. 

### Optical Character Recognition - Images to Text - Printed content

:triangular_flag_on_post: **Goal:** Leverage OCR to make a printed text document in images machine-readable

It is very similar as the previous example- except that is a synchronous call, hence we directly get back the recognition result. Go ahead and copy the Code into a new Cell into your `CognitiveServices.ipynb` Notebook:

```python
url = "https://" + location + ".api.cognitive.microsoft.com/vision/v3.2/ocr"
image_url = "https://bootcamps.blob.core.windows.net/ml-test-images/ocr_printed_1.jpg"

headers = {'Ocp-Apim-Subscription-Key': subscription_key}
params  = {'language': 'unk', 'detectOrientation': 'true'}
data    = {'url': image_url}

response = requests.post(url, headers=headers, params=params, json=data)
recognition_result = response.json()

# Extract the word bounding boxes and text
line_infos = [region["lines"] for region in recognition_result["regions"]]
word_infos = []
for line in line_infos:
    for word_metadata in line:
        for word_info in word_metadata["words"]:
            word_infos.append(word_info)
word_infos
```

**Example JSON response (just a snippet):**

```json
[{'boundingBox': '31,50,817,70', 'text': 'LUFTPOLSTERTASCHEN'},
 {'boundingBox': '30,219,23,24', 'text': 'u'},
 {'boundingBox': '68,216,168,27', 'text': 'Fensterlose'},
 {'boundingBox': '247,216,263,37', 'text': 'Schutzumschläge'},
 {'boundingBox': '522,221,47,26', 'text': 'mit'},
 {'boundingBox': '580,221,182,37', 'text': 'Haftklebung'},
 {'boundingBox': '66,276,149,34', 'text': 'Optimaler'},
 {'boundingBox': '225,276,99,27', 'text': 'Schutz'},
 {'boundingBox': '334,277,84,26', 'text': 'durch'},
 {'boundingBox': '432,277,227,35', 'text': 'Luftpolsterfolie'}]
```

**Visualization:**

```python
# Display the image and overlay it with the extracted text
plt.figure(figsize=(15, 15))
image = Image.open(BytesIO(requests.get(image_url).content))
ax = plt.imshow(image, alpha=0.5)
for word in word_infos:
    bbox = [int(num) for num in word["boundingBox"].split(",")]
    text = word["text"]
    origin = (bbox[0], bbox[1])
    patch  = Rectangle(origin, bbox[2], bbox[3], fill=False, linewidth=2, color='y')
    ax.axes.add_patch(patch)
    plt.text(origin[0], origin[1], text, fontsize=11, va="top")
_ = plt.axis("off")
```

**Example Result:**

![Result](./images/OCRResult.png)

**Here is one more [image](https://bootcamps.blob.core.windows.net/ml-test-images/ocr_printed_2.jpg) we can test with!**

From recognizing text on images we will now detect objects on images for this we will introduce the **Custom Vision Cognitive Service.**

**Azure Custom Vision** is an image recognition service that lets you build, deploy, and improve your own image identifiers. An image identifier applies labels (which represent classes or objects) to images, according to their visual characteristics. Unlike the Computer Vision service, Custom Vision allows you to specify the labels and train custom models to detect them.

**What it does?**
The Custom Vision service uses a machine learning algorithm to analyze images. You, the developer, submit groups of images that feature and lack the characteristics in question. You label the images yourself at the time of submission. Then, the algorithm trains to this data and calculates its own accuracy by testing itself on those same images. Once the algorithm is trained, you can test, retrain, and eventually use it in your image recognition app to classify new images. You can also export the model itself for offline use.

Now let's create our own Custom Vision Service.

# Custom Vision

|Azure Cognitive Services|Information|
|---|---|
|[Custom Vision API](https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/)|https://docs.microsoft.com/en-us/azure/cognitive-services/custom-vision-service/

:triangular_flag_on_post: **Goal:** Detect beer glasses in images

In this chapter, we will use [Custom Vision](https://customvision.ai) to detect beer glasses in images - [Image Dataset for training and testing](https://bootcamps.blob.core.windows.net/ml-test-images/beer_glasses.zip)

First we deploy the **Azure Custom Vision** Service in the **Azure Portal**:

![Azure Portal](./images/CustomVision1.png)

The Custom Vision Service has 2 types of endpoints. One for training the model and one for running predictions against the model. Fill in the *name* and the *location* as well as the *pricing tier* for the training and the prediction resource:

![Azure Portal](./images/CustomVision2.png)

Then, log in to [Custom Vision](https://www.customvision.ai/) with your Azure credentials.

Create a new project of type `Object detection`:

![alt text](./images/CustomVision4.png "Custom Vision Project")

Next, add all the **training images** from the **unzipped** [dataset](https://bootcamps.blob.core.windows.net/ml-test-images/beer_glasses.zip) within the **beer_glasses_train**. 

![alt text](./images/CustomVision6.png "Tagging the training images")

Once added, we need to tag all the beer glasses in the images. If there are multiple glasses in one image, tag each one individually:

![alt text](./images/customvision_tagging.png "Tagging the training images")

Once we've tagged all 15 images (that's the minimum), we can hit the `Train` button. After 1-2 minutes, we'll see the training statistics:

![alt text](./images/customvision_performance.png "Object Detection performance")

Let's briefly look at the results and make sure we understand them:

Sliders - they set the results given certain thresholds
* Probability Threshold: 82% - this means we only count detections with over 82% probability as beer glasses
* Overlap Threshold: 51% - this means we want our detection results overlap at least 51% with the ground truth in the training set

Results:
* Precision: 30% - given a detection, it is 30% correct on average (meaning the algorithm will also detect other objects as glasses)
* Recall: 100% - a recall of 100% means, it will detect all beer glasses (but maybe mistake some other objects as beer glasses too)
* mAP: 83.3% - mean average precision - the average how well our detection algorithm works 

Under `Quick Test`, we can briefly upload our testing images and see what the service will detect. As we only added 15 training images with a lot of variance, the results are not great yet. By adding more images, we could most likely improve the detection performance significantly.

If we go to the `Performance` tab, we can get the `Prediction URL` and the `Prediction-Key`. We can use this endpoint to programmatically access the service.

## What we have done so far:

- We deployed several Cognitive Services using the Azure Portal
- We called those Cognitive Service REST APIs by using Python
- We trained custom machine learning models (e.g. Custom Vision and Language Understanding) using an UI

As we have seen the Cognitive Services one by one, we want to still continue to combine the ml expert view with the developer view. Thus we will take the Custom Vision Service which we have learned about and will integrate it into a small application. So let's continue to the next challenge.

:zap: Let's go to **[AI Developer College Day2 - Custom Vision Application](../../CustomVisionApp/CustomVisionApp.md)**!

## House Keeping: Lab Cleanup

Remove the sample resource group.

```shell
$ az group delete -n <yourResourceGroup>
```

## Optional: Play around with the: Intelligent Kiosk 

Find the Sample on Github here: [Intelligent Kiosk](https://github.com/microsoft/Cognitive-Samples-IntelligentKiosk)
