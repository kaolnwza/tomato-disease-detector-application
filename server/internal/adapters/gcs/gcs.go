package gcs

import (
	"context"
	"os"
	log "tomato-api/lib/logs"

	"cloud.google.com/go/storage"
	"google.golang.org/api/option"
)

func NewGCSClient() *storage.Client {
	storageClient, err := storage.NewClient(context.Background(), option.WithCredentialsFile(os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")))
	if err != nil {
		log.Error(err)
		return nil
	}

	return storageClient
}
