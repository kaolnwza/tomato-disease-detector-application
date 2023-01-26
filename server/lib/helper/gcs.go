package helper

import (
	"context"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

func GenerateImageURI(ctx context.Context, bucket string, objectLocation string) (string, error) {
	storageClient, err := storage.NewClient(ctx, option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		return "", err
	}

	opts := &storage.SignedURLOptions{
		Scheme:  storage.SigningSchemeV4,
		Method:  "GET",
		Expires: time.Now().Add(15 * time.Minute),
	}

	url, err := storageClient.Bucket(bucket).SignedURL(objectLocation, opts)
	if err != nil {
		return "", err
	}

	return url, nil
}
