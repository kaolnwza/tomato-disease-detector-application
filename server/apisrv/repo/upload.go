package repo

import (
	"tomato-api/apisrv/model"

	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
)

func UploadImage(tx sqlx.Queryer, upload *model.Upload, path string, bucket string, userUUID uuid.UUID) error {
	s := `
		INSERT INTO upload (user_uuid, bucket, path)
		SELECT $1, $2, $3
		RETURNING upload_uuid
	`

	return sqlx.Get(tx, &upload.UUID, s, userUUID, bucket, path)

}

func FetchImageURIByUUID(tx sqlx.Queryer, upload *model.Upload, uploadUUID uuid.UUID) error {
	s := `
		SELECT bucket, path
		FROM upload
		WHERE uuid = $1
	`

	return sqlx.Get(tx, upload, s, uploadUUID)
}
