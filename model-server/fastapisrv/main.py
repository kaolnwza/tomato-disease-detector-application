

# import pandas as pd
import torchvision.transforms.functional as TF
import os
import numpy as np
import torch
from pathlib import Path
import torch.nn as nn
from torchvision.transforms import transforms
from torch.utils.data import DataLoader, Dataset
from torch.optim import Adam
from torch.autograd import Variable
from datetime import datetime
from torch.utils.data.sampler import SubsetRandomSampler
import cv2 as cv
import base64
import io
from PIL import Image

from typing import Union
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
import ssl
ssl._create_default_https_context = ssl._create_unverified_context


classes = ['Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
           'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy']

resnet18 = torch.hub.load('pytorch/vision:v0.8.0',
                          'densenet121', pretrained=False)

model = resnet18

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.001)

transformer = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
])

model_dir = "./pymodel"
if os.environ["HOST_URL"] != "localhost":
    model_dir = "." + model_dir

model.load_state_dict(torch.load(
    # "resnet18-lr0.001-10 ithink0.0001.pt", map_location='cpu'))
    "./ptmodel/dense-lr0.001-10.pt", map_location='cpu'))

model.eval()


def predictionImg(image):
    image_tensor = transformer(image)
    image_tensor = image_tensor.unsqueeze_(0)
    input_img = Variable(image_tensor)
    output = model(input_img)
    index = output.data.numpy().argmax()
    pred = classes[index]
    # labels = torch.tensor(classes[index])
    # print(labels)
    return pred


class Img(BaseModel):
    image: str


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


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
    b = base64.b64decode(item.image)
    img = Image.open(io.BytesIO(b))
    # img.show()
    # img.show()
    resp = predictionImg(img)
    # print(resp)
    return resp


@app.post("/imgpred/resnet")
async def imgpred(item: Img):

    b = base64.b64decode(item.image)
    img = Image.open(io.BytesIO(b))
    resp = predictionImg(img)
    return resp

if __name__ == "__main__":
    uvicorn.run(app, host=os.environ['HOST_URL'], port=1234)
