import os
import numpy as np
import torch
import glob
import torch.nn as nn
from torchvision.transforms import transforms
from torch.utils.data import DataLoader
from torch.optim import Adam
from torch.autograd import Variable
import torchvision
import pathlib
from datetime import datetime
from torch.utils.data.sampler import SubsetRandomSampler
import cv2 as cv

import seaborn as sns
import matplotlib.pyplot as plt
from PIL import Image


import torchvision.transforms.functional as TF

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


model = CNN()
# device = 'cpu'
# model.to(device)
criterion = nn.CrossEntropyLoss()
# optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

for param_tensor in model.state_dict():
    print(param_tensor, "\t", model.state_dict()[param_tensor].size())
# model = CNN()

print("Optimizers state_dict:")
for var_name in optimizer.state_dict():
    print(var_name, "\t", optimizer.state_dict()[var_name])


# model.load_state_dict(torch.load("modelkub.pt"))
# model.eval()


model.load_state_dict(torch.load("modeljra.pt", map_location='cpu'))
# # load = torch.load("modelkub.pt")
# model.eval()


# ps, classes2 = predict(
#     "./test/0db85707-41f9-42df-ba3b-842d14f00a68___GHLB2 Leaf 8909.JPG", model)
# print(ps, classes2)
def prediction123(img_path, transformer):
    image = Image.open(img_path).convert('RGB')
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
pred_path = 'test/bacterisspot'
test_imgs = glob.glob(pred_path+'/*')

print('test_imgs', test_imgs)

transformeree = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    # transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])
print('test')

for i in test_imgs:
    print(prediction123(i, transformeree))
print('endloop')

# print('clas', classes)
