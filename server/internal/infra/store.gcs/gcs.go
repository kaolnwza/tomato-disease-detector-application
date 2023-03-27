package gcs

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"time"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

type gcsStorer struct {
	cli *storage.Client
	port.ImageStorer
}

func NewGCSStorer(cli *storage.Client) port.ImageStorer {
	return gcsStorer{cli: cli}
}

func (g gcsStorer) UploadImage(ctx context.Context, file multipart.File, bucket string) (*model.Upload, error) {
	var err error

	objectLocation := fmt.Sprintf(`images/%s`, uuid.New())

	sw := g.cli.Bucket(bucket).Object(objectLocation).NewWriter(ctx)

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

	return &upload, nil
}

func (g gcsStorer) GenerateImageURI(ctx context.Context, bucket string, objectLocation string) (string, error) {

	opts := &storage.SignedURLOptions{
		Scheme:  storage.SigningSchemeV4,
		Method:  "GET",
		Expires: time.Now().Add(15 * time.Minute),
	}

	url, err := g.cli.Bucket(bucket).SignedURL(objectLocation, opts)
	if err != nil {
		return "", err
	}

	return url, nil
}
