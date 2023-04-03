package service

import (
	"context"
	"mime/multipart"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

var (
	storageClient *storage.Client
)

type uploadService struct {
	uploadRepo port.UploadRepository
	tx         port.Transactor
	storer     port.ImageStorer
}

func NewUploadService(r port.UploadRepository, tx port.Transactor, storer port.ImageStorer) port.UploadService {
	return &uploadService{uploadRepo: r, tx: tx, storer: storer}
}

func (s uploadService) Upload(ctx context.Context, userUUID uuid.UUID, file multipart.File, bucket string) (*model.Upload, error) {
	upload, err := s.storer.UploadImage(ctx, file, bucket)
	if err != nil {
		return nil, err
	}

	upload.UserUUID = userUUID
	if err := s.uploadRepo.Upload(ctx, upload); err != nil {
		return nil, err
	}

	return upload, nil
}
