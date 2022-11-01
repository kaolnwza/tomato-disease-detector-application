from sklearn.metrics import confusion_matrix, classification_report
import seaborn as sn
import pandas as pd
from torchvision.transforms.functional import to_pil_image
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2, FasterRCNN_ResNet50_FPN_V2_Weights
from torchvision.io.image import read_image
import argparse
import random
import pandas as pd
import torchvision.transforms.functional as TF
from io import BytesIO
import requests
import os
import numpy as np
import torch
import glob
from pathlib import Path
import torch.nn as nn
from torchvision.transforms import transforms
from torch.utils.data import DataLoader, Dataset
from torch.optim import Adam
from torch.autograd import Variable
import torchvision
import pathlib
from datetime import datetime
from torch.utils.data.sampler import SubsetRandomSampler
import cv2 as cv
import base64
import io

from base64test import byte_data
import seaborn as sns
import matplotlib.pyplot as plt
from PIL import Image
import urllib.request
from torchvision.io import read_image
from torchvision.utils import draw_bounding_boxes
import ssl
ssl._create_default_https_context = ssl._create_unverified_context


model = torch.hub.load('pytorch/vision:v0.10.0',
                       'resnet18', pretrained=False)

# model = torch.hub.load('pytorch/vision:v0.10.0',
#                        'mobilenet_v2', pretrained=False)
# model = torch.hub.load('pytorch/vision:v0.10.0', 'googlenet', pretrained=False)

# resnet18 = torch.jit.load('resnet.py')
#                           'resnet18', pretrained=False)
# model = AlexNet()
# model = resnet18

# device = 'cpu'
# model.to(device)
criterion = nn.CrossEntropyLoss()
# optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)


transformer = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    # transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
    transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
])


model.load_state_dict(torch.load(
    # "lr0.001-alexk2-overfit-modeleiei.pt", map_location='cpu'))
    # "lol555.pt", map_location='cpu'))
    # "lol555-lr0.0001-20.pt", map_location='cpu'))
    # "resnet-lr0.00001-20.pt", map_location='cpu'))
    # "goog-lr0.0001-10.pt", map_location='cpu'))
    # "goog-lr0.00005-10.pt", map_location='cpu'))
    # "goog-lr0.00001-10.pt", map_location='cpu'))
    # "mb-lr0.0005-10.pt", map_location='cpu'))
    # "resnet18-lr0.005-10.pt", map_location='cpu'))
    "resnet18-lr0.001-10 ithink0.0001.pt", map_location='cpu'))
# "lol555-lr0.001.pt", map_location='cpu'))
# "cv_resnet.pt", map_location='cpu'))
# "resnet18-overfit.pt", map_location='cpu'))
# "alexkcross.pt", map_location='cpu').state_dict())
# # load = torch.load("modelkub.pt")
model.eval()

test_loader = DataLoader(
    torchvision.datasets.ImageFolder(

        # "/Users/kaolnwza/Downloads/PlantDiseasesDataset/Tomato/train", transform=transformer),
        "/Users/kaolnwza/Downloads/make k-5/k1/train", transform=transformer),
    batch_size=32,
    # sampler=test_sampler
    shuffle=True
)


y_pred = []
y_true = []


# iterate over test data
count = 0
for inputs, labels in test_loader:
    print(count)
    if count == 50:
        break

    inputs, labels = inputs.to('cpu'), labels.to('cpu')
    output = model(inputs)  # Feed Network
    output = (torch.max(torch.exp(output), 1)[1]).data.cpu().numpy()
    y_pred.extend(output)  # Save Prediction
    labels = labels.data.cpu().numpy()
    y_true.extend(labels)  # Save Truth
    count += 1

# constant for classes
classes = ('Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
           'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy')

# Build confusion matrix
cf_matrix = confusion_matrix(y_true, y_pred)
df_cm = pd.DataFrame(cf_matrix/np.sum(cf_matrix) * 10, index=[i for i in classes],
                     columns=[i for i in classes])
plt.figure(figsize=(12, 7))
sn.heatmap(df_cm, annot=True)
# plt.show()
plt.savefig('output.png')
