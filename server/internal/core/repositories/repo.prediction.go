package repo

import (
	"context"
	"mime/multipart"
)

type PredictionService interface {
	PredictTomato(context.Context, multipart.File, *multipart.FileHeader) (*string, error)
}
