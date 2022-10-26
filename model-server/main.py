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

from typing import Union
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

import ssl
ssl._create_default_https_context = ssl._create_unverified_context


classes = ['Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
           'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']


class CNN(nn.Module):
    # initialize the class and the parameters
    def __init__(self):
        super(CNN, self).__init__()

        # convolutional layer 1 & max pool layer 1
        self.layer1 = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2))

        # convolutional layer 2 & max pool layer 2
        self.layer2 = nn.Sequential(
            nn.Conv2d(16, 32, kernel_size=3, padding=1, stride=2),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2))

        # Fully connected layer
        self.fc = nn.Linear(32*28*28, 10)

    # Feed forward the network
    def forward(self, x):
        out = self.layer1(x)
        out = self.layer2(out)
        out = out.reshape(out.size(0), -1)
        out = self.fc(out)
        return out


class AlexNet(nn.Module):
    def __init__(self, num_classes: int = 10, dropout: float = 0.5) -> None:
        super().__init__()
        # _log_api_usage_once(self)
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=11, stride=4, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(64, 192, kernel_size=5, padding=2),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
            nn.Conv2d(192, 384, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(384, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=3, stride=2),
        )
        self.avgpool = nn.AdaptiveAvgPool2d((6, 6))
        self.classifier = nn.Sequential(
            nn.Dropout(p=dropout),
            nn.Linear(256 * 6 * 6, 4096),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout),
            nn.Linear(4096, 4096),
            nn.ReLU(inplace=True),
            nn.Linear(4096, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x


# resnet18 = torch.hub.load('pytorch/vision:v0.10.0',
#                           'resnet18', pretrained=False)
resnet18 = torch.hub.load('pytorch/vision:v0.10.0',
                          'resnet18', pretrained=False)


# resnet18 = torch.jit.load('resnet.py')
#                           'resnet18', pretrained=False)
# model = AlexNet()
model = resnet18

# device = 'cpu'
# model.to(device)
criterion = nn.CrossEntropyLoss()
# optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)

# for param_tensor in model.state_dict():
#     print(param_tensor, "\t", model.state_dict()[param_tensor].size())
# model = CNN()

# print("Optimizers state_dict:")
# for var_name in optimizer.state_dict():
#     print(var_name, "\t", optimizer.state_dict()[var_name])


# model.load_state_dict(torch.load("modelkub.pt"))
# model.eval()
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
    "resnet-lr0.00001-20.pt", map_location='cpu'))
# "lol555-lr0.001.pt", map_location='cpu'))
# "cv_resnet.pt", map_location='cpu'))
# "resnet18-overfit.pt", map_location='cpu'))
# "alexkcross.pt", map_location='cpu').state_dict())
# # load = torch.load("modelkub.pt")
model.eval()


def prediction(img_path):

    image = Image.open(img_path).convert('RGB')
    image_tensor = transformer(image)
    image_tensor = image_tensor.unsqueeze_(
        0)  # so img is not treated as a batch
    input_img = Variable(image_tensor)
    output = model(input_img)
    # print(output)
    # print(torch.Tensor(output))
#     img2 = draw_bounding_boxes(input_img, output, width=5,
#                                colors="green",
#                                fill=True)

# # transform this image to PIL image
#     img2 = torchvision.transforms.ToPILImage()(img2)

# # display output
#     img2.show()

    index = output.data.numpy().argmax()
    pred = classes[index]
    return pred


def predictionImg(image):

    # image = Image.open(img_path)
    image_tensor = transformer(image)
    image_tensor = image_tensor.unsqueeze_(
        0)  # so img is not treated as a batch
    input_img = Variable(image_tensor)
    output = model(input_img)

    index = output.data.numpy().argmax()
    pred = classes[index]
    return pred


def predictionURL(img):
    image = img.convert('RGB')
    image_tensor = transformer(image)
    image_tensor = image_tensor.unsqueeze_(
        0)  # so img is not treated as a batch
    input_img = Variable(image_tensor)
    output = model(input_img)

    # print(output)
    index = output.data.numpy().argmax()
    pred = classes[index]
    return pred


# pred_path = 'test/lateb'
# pred_path = 'test/health'
# pred_path = 'train/health'
# pred_path = 'test/bacterisspot'
# pred_path = 'google/latebli'
# pred_path = 'google/health'
# pred_path = 'google/bacteriaspot'
# pred_path = 'google/earlybli'
# pred_path = 'kremove/bac'
# pred_path = 'kremove/yel'
pred_path = 'kremove/mold'
# pred_path = 'kremove/health'
# pred_path = 'google/yellow'
test_imgs = glob.glob(pred_path+'/*')


# for bigi in range(1):
#     print(bigi)
#     for i in test_imgs:
#         prediction(i)
#     print(prediction(i))


# print(predictionURL(
#     "https://suzannerbanks.files.wordpress.com/2013/01/tomato-leaf.jpg"
# ))
class Img(BaseModel):
    img: str


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/yedped")
def yesped():
    x = predictionURL(
        "https://suzannerbanks.files.wordpress.com/2013/01/tomato-leaf.jpg")
    return x


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/imgkub")
async def imgtestlol(item: Img):
    b = base64.b64decode(item.img)
    img = Image.open(io.BytesIO(b))
    img.show()


@app.post("/imgpred")
async def imgpred(item: Img):
    # x = item.img
    # base64_bytes = x.encode("ascii")
    # xx = base64.b64encode(base64_bytes)
    # b = base64.b64decode(xx)
    b = base64.b64decode(item.img)
    img = Image.open(io.BytesIO(b))
    # img.show()
    # img.show()
    resp = predictionImg(img)
    print(resp)
    return resp


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=1234)
