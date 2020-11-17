import pickle
import os
import numpy as np
import pandas as pd
import json
import subprocess

from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from joblib import dump
from typing import Tuple, List

import matplotlib.pyplot as plt
import seaborn as sns

from azureml.core import Workspace, Datastore, Dataset
from azureml.core.run import Run
from azureml.core.model import Model

run = Run.get_context()
exp = run.experiment
ws = run.experiment.workspace

print("Loading training data...")
# https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html
datastore = ws.get_default_datastore()
datastore_paths = [(datastore, 'diabetes/diabetes.csv')]
traindata = Dataset.Tabular.from_delimited_files(path=datastore_paths)
diabetes = traindata.to_pandas_dataframe()
print("Columns:", diabetes.columns) 
print("Diabetes data set dimensions : {}".format(diabetes.shape))

y = diabetes.pop('Y')
X_train, X_test, y_train, y_test = train_test_split(diabetes, y, test_size=0.2, random_state=0)
data = {"train": {"X": X_train, "y": y_train}, "test": {"X": X_test, "y": y_test}}

print("Training the model...")
# Randomly pic alpha
alphas = np.arange(0.0, 1.0, 0.05)
alpha = alphas[np.random.choice(alphas.shape[0], 1, replace=False)][0]
print("alpha:", alpha)
run.log("alpha", alpha)
reg = Ridge(alpha=alpha)
reg.fit(data["train"]["X"], data["train"]["y"])
run.log_list("coefficients", reg.coef_)

print("Evaluate the model...")
preds = reg.predict(data["test"]["X"])
mse = mean_squared_error(preds, data["test"]["y"])
print("Mean Squared Error:", mse)
run.log("mse", mse)

# Save model as part of the run history
print("Exporting the model as pickle file...")
outputs_folder = './model'
os.makedirs(outputs_folder, exist_ok=True)

model_filename = "sklearn_diabetes_model.pkl"
model_path = os.path.join(outputs_folder, model_filename)
dump(reg, model_path)

# upload the model file explicitly into artifacts
print("Uploading the model into run artifacts...")
run.upload_file(name="./outputs/models/" + model_filename, path_or_stream=model_path)
print("Uploaded the model {} to experiment {}".format(model_filename, run.experiment.name))
dirpath = os.getcwd()
print(dirpath)
print("Following files are uploaded ")
print(run.get_file_names())

run.complete()