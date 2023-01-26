package repo

import (
	"context"
	"mime/multipart"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type UploadRepository interface {
	Upload(context.Context, *model.Upload) error
}

type UploadService interface {
	Upload(context.Context, uuid.UUID, multipart.File, string) (*model.Upload, error)
}
