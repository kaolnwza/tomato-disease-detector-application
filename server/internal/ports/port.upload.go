package port

import (
	"context"
	"mime/multipart"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type UploadRepository interface {
	Upload(context.Context, *model.Upload) (uuid.UUID, error)
}

type UploadService interface {
	Upload(context.Context, uuid.UUID, multipart.File, string) (*model.Upload, error)
}
