package port

import (
	"context"
	"mime/multipart"
	model "tomato-api/internal/core/models"
)

type PredictionService interface {
	PredictTomato(context.Context, multipart.File, *multipart.FileHeader) (*model.PredictionResponse, error)
}
