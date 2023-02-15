package service

import (
	"context"
	"mime/multipart"
	"strconv"
	"strings"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
)

type predictionService struct {
	port.PredictionService
	diseaseSvc port.TomatoDiseaseService
}

func NewPredictionService(diseseSvc port.TomatoDiseaseService) port.PredictionService {
	return &predictionService{diseaseSvc: diseseSvc}
}

func (s predictionService) PredictTomato(ctx context.Context, file multipart.File, fileHeader *multipart.FileHeader) (*model.PredictionResponse, error) {
	resp, err := helper.PostRequestImage(file, fileHeader)
	if err != nil {
		return nil, err
	}

	respStr, err := helper.Base64ToString(*resp)
	if err != nil {
		return nil, err
	}

	respSlice := strings.Split(*respStr, ",")
	diseaseName := respSlice[0]
	score, err := strconv.ParseFloat(respSlice[1], 64)
	if err != nil {
		return nil, err
	}

	pred := model.PredictionResponse{
		PredictionResult: diseaseName,
		PredictionScore:  score * 100,
	}

	disease, err := s.diseaseSvc.GetTomatoDiseaseByName(ctx, diseaseName)
	if err != nil {
		return nil, err
	}

	pred.DiseaseInfo = disease

	return &pred, err
}
