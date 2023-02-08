package pgsql

import (
	"context"
	db "tomato-api/internal/adapters/database"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/google/uuid"
)

type tomatoLogRepo struct {
	tx db.Transactor
}

func NewTomatoLogRepo(tx db.Transactor) port.TomatoLogRepository {
	return &tomatoLogRepo{tx: tx}
}

func (r *tomatoLogRepo) GetByFarmUUID(ctx context.Context, log *[]*model.TomatoLog, farmUUID uuid.UUID) error {
	query := `
		SELECT 
			tomato_log_uuid,
			recorder_uuid,
			description,
			tomato_log.created_at,
			path AS "upload_path",
			disease_name "tomato_disease_info.disease_name",
			disease_name_th "tomato_disease_info.disease_name_th",
			ST_AsGeoJSON("location")::json->>'coordinates' "location"
		FROM tomato_log
		LEFT JOIN upload ON upload.upload_uuid = tomato_log.upload_uuid
		LEFT JOIN tomato_disease_info ON tomato_disease_info.disease_uuid = tomato_disease_uuid
		WHERE EXISTS (
			SELECT 1 
			FROM farm_plot
			WHERE farm_uuid = $1
			AND farm_plot.farm_plot_uuid = tomato_log.farm_plot_uuid
		)
		ORDER BY created_at DESC
 `

	return r.tx.Get(ctx, log, query, farmUUID.String())
}

func (r *tomatoLogRepo) GetByUserUUID(ctx context.Context, log *[]*model.TomatoLog, userUUID uuid.UUID) error {
	query := `
		SELECT 
			tomato_log_uuid,
			recorder_uuid,
			description,
			tomato_log.created_at,
			path AS "upload_path",
			disease_name "tomato_disease_info.disease_name",
			disease_name_th "tomato_disease_info.disease_name_th",
			ST_AsGeoJSON("location")::json->>'coordinates' "location"
		FROM tomato_log
		LEFT JOIN upload ON upload.upload_uuid = tomato_log.upload_uuid
		LEFT JOIN tomato_disease_info ON tomato_disease_info.disease_uuid = tomato_disease_uuid
		WHERE recorder_uuid = $1
		ORDER BY created_at DESC
 `

	return r.tx.Get(ctx, log, query, userUUID.String())
}

func (r *tomatoLogRepo) GetByLogUUID(ctx context.Context, log *model.TomatoLog, logUUID uuid.UUID) error {
	query := `
		SELECT 
			tomato_log_uuid,
			recorder_uuid,
			description,
			tomato_log.created_at,
			path AS "upload_path",
			disease_name "tomato_disease_info.disease_name",
			disease_name_th "tomato_disease_info.disease_name_th",
			ST_AsGeoJSON("location")::json->>'coordinates' "location"
		FROM tomato_log
		LEFT JOIN upload ON upload.upload_uuid = tomato_log.upload_uuid
		LEFT JOIN tomato_disease_info ON tomato_disease_info.disease_uuid = tomato_disease_uuid
		WHERE tomato_log_uuid = $1
		ORDER BY created_at DESC
 `

	return r.tx.GetOne(ctx, log, query, logUUID.String())
}

func (r *tomatoLogRepo) Create(
	ctx context.Context,
	logs *model.TomatoLog,
	// recorderUUID uuid.UUID,
	farmUUID uuid.UUID,
	// uploadUUID uuid.UUID,
	diseaseName string,
	location string,
	// description string,
	// location string,
) error {
	query := `
		INSERT INTO tomato_log (recorder_uuid, farm_plot_uuid, upload_uuid, tomato_disease_uuid, description, location
			)
		SELECT 
			$1, 
			(SELECT farm_plot_uuid FROM farm_plot WHERE farm_uuid = $2 LIMIT 1), 
			$3,
			(SELECT disease_uuid FROM tomato_disease_info WHERE disease_name = $4), 
			$5, $6
`

	// return r.tx.Insert(ctx, query, logs.RecorderUUID.String(), farmUUID.String(), logs.UploadUUID.String(), diseaseName, logs.Description, logs.Location)
	return r.tx.Insert(ctx, query, logs.RecorderUUID.String(), farmUUID.String(), logs.UploadUUID.String(), diseaseName, logs.Description, location)
}
