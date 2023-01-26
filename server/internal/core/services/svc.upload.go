package service

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"os"
	model "tomato-api/internal/core/models"
	repo "tomato-api/internal/core/repositories"
	database "tomato-api/lib/database/postgres"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
	"google.golang.org/api/option"
)

var (
	storageClient *storage.Client
)

type uploadService struct {
	uploadRepo repo.UploadRepository
	tx         database.Transactor
}

func NewUploadService(r repo.UploadRepository, tx database.Transactor) repo.UploadService {
	return &uploadService{uploadRepo: r, tx: tx}
}

func (s uploadService) Upload(ctx context.Context, userUUID uuid.UUID, file multipart.File, bucket string) (*model.Upload, error) {
	var err error

	storageClient, err = storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return nil, err
	}

	objectLocation := fmt.Sprintf(`image/%s`, uuid.New())

	sw := storageClient.Bucket(bucket).Object(objectLocation).NewWriter(ctx)

	if _, err := io.Copy(sw, file); err != nil {
		return nil, err
	}

	if err := sw.Close(); err != nil {
		return nil, err
	}

	u, err := url.Parse(sw.Attrs().Name)
	if err != nil {
		return nil, err
	}

	var upload model.Upload
	upload.Bucket = bucket
	upload.Path = u.EscapedPath()
	upload.UserUUID = userUUID

	if err := s.uploadRepo.Upload(ctx, &upload); err != nil {
		return nil, err
	}

	return &upload, nil
}
