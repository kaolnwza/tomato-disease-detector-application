package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/google/uuid"
)

type uploadRepo struct {
	tx port.Transactor
}

func NewUploadRepo(tx port.Transactor) port.UploadRepository {
	return &uploadRepo{tx: tx}
}

func (r uploadRepo) Upload(ctx context.Context, upload model.Upload) (uuid.UUID, error) {
	query := `
		INSERT INTO upload (user_uuid, bucket, path)
		SELECT $1, $2, $3
		RETURNING upload_uuid
	`

	if err := r.tx.InsertWithReturningOne(ctx, &upload.UUID, query, upload.UserUUID, upload.Bucket, upload.Path); err != nil {
		return uuid.Nil, err
	}

	return upload.UUID, nil
}
