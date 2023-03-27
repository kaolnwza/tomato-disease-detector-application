package gcs

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
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

func (g *gcsStorer) GCSUploadImage(file multipart.File, bucket string) (*model.Upload, error) {
	ctx := context.Background()
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
