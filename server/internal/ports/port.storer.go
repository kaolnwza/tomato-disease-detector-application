package port

import (
	"mime/multipart"
	model "tomato-api/internal/core/models"
)

type ImageStorer interface {
	UploadImages(file multipart.File, bucket string) (*model.Upload, error)
}
