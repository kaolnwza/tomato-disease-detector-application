package port

import (
	"context"
	"mime/multipart"
	model "tomato-api/internal/core/models"
)

type ImageStorer interface {
	UploadImage(ctx context.Context, file multipart.File, bucket string) (model.Upload, error)
	GenerateImageURI(ctx context.Context, bucket string, objectLocation string) (string, error)
}
