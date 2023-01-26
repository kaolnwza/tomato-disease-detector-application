package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	repo "tomato-api/internal/core/repositories"
	database "tomato-api/lib/database/postgres"
)

type uploadRepo struct {
	tx database.Transactor
}

func NewUploadRepo(tx database.Transactor) repo.UploadRepository {
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
