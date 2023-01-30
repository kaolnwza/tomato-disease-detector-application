package pgsql

import (
	"context"
	db "tomato-api/internal/adapters/database"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
)

type uploadRepo struct {
	tx db.Transactor
}

func NewUploadRepo(tx db.Transactor) port.UploadRepository {
	return &uploadRepo{tx: tx}
}

func (r uploadRepo) Upload(ctx context.Context, upload *model.Upload) error {
	query := `
		INSERT INTO upload (user_uuid, bucket, path)
		SELECT $1, $2, $3
		RETURNING upload_uuid
	`

	return r.tx.InsertWithReturningOne(ctx, &upload.UUID, query, upload.UserUUID, upload.Bucket, upload.Path)
}
