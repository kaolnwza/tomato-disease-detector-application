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


# model = CNN()
model = CNN()
# model.load_state_dict(torch.load("modelkub.pt"))
# model.eval()

model.load_state_dict(torch.load("modelkub.pt"))
# load = torch.load("modelkub.pt")
model.eval()
