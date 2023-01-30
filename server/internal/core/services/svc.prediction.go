package service

import (
	"context"
	"mime/multipart"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
)

type predictionService struct {
	port.PredictionService
}

func NewPredictionService() port.PredictionService {
	return &predictionService{}
}

func (s predictionService) PredictTomato(ctx context.Context, file multipart.File, fileHeader *multipart.FileHeader) (*string, error) {
	resp, err := helper.PostRequestImage(file, fileHeader)
	if err != nil {
		return nil, err
	}

	respStr, err := helper.Base64ToString(*resp)
	if err != nil {
		return nil, err
	}

	return respStr, err
}
