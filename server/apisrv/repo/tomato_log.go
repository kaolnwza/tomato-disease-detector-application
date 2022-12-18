package repo

import (
	"tomato-api/apisrv/model"

	"github.com/jmoiron/sqlx"
	uuid "github.com/satori/go.uuid"
)

func CreateTomatoLog(tx sqlx.Execer, description string, disease string, uploadUUID uuid.UUID, userUUID uuid.UUID) error {
	s := `
	INSERT INTO tomato_log (farm_plot_uuid, recorder_uuid, tomato_disease_uuid, description, upload_uuid)
	SELECT 
		$1, 
		$2, 
		(SELECT disease_uuid FROM tomato_disease_info WHERE disease_name = $3), 
		$4, 
		$5
`

	_, err := tx.Exec(s, "4b1271ee-0c18-4e96-8348-2f98f3312370", userUUID, disease, description, uploadUUID)
	return err
}

func FetchTomatoLogByUserUUID(tx sqlx.Queryer, log *[]*model.TomatoLog, userUUID uuid.UUID) error {
	s := `
	SELECT 
		tomato_log_uuid,
		farm_plot_uuid,
		recorder_uuid
		tomato_disease_uuid,
		description,
		tomato_log.created_at,
		path AS "upload_path"
	FROM tomato_log
	LEFT JOIN upload ON upload.upload_uuid = tomato_log.upload_uuid
	WHERE recorder_uuid = $1
	`

	return sqlx.Select(tx, log, s, userUUID)
}
