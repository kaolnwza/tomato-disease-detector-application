package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/google/uuid"
)

type tomatoLogRepo struct {
	tx port.Transactor
}

func NewTomatoLogRepo(tx port.Transactor) port.TomatoLogRepository {
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
			ST_AsGeoJSON("location")::json->>'coordinates' "location",
			status
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
			ST_AsGeoJSON("location")::json->>'coordinates' "location",
			status
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
			ST_AsGeoJSON("location")::json->>'coordinates' "location",
			status
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
	farmUUID uuid.UUID,
	diseaseName string,
	location string,
	status model.TomatoLogStatus,
) error {
	query := `
		INSERT INTO tomato_log (recorder_uuid, farm_plot_uuid, upload_uuid, tomato_disease_uuid, description, location, status)
		SELECT 
			$1, 
			(SELECT farm_plot_uuid FROM farm_plot WHERE farm_uuid = $2 LIMIT 1), 
			$3,
			(SELECT disease_uuid FROM tomato_disease_info WHERE disease_name = $4), 
			$5, 
			$6,
			$7
`

	return r.tx.Insert(ctx, query, logs.RecorderUUID.String(), farmUUID.String(), logs.UploadUUID.String(), diseaseName, logs.Description, location, status)
}

func (r *tomatoLogRepo) Update(ctx context.Context, logUUID uuid.UUID, desc string, diseaseName string, location string, status model.TomatoLogStatus) error {
	query := `
	UPDATE tomato_log
	SET
		description = $2,
		tomato_disease_uuid = (SELECT disease_uuid FROM tomato_disease_info WHERE disease_name = $3),
		location = $4,
		status = $5
	WHERE tomato_log_uuid = $1
`

	return r.tx.Insert(ctx, query, logUUID, desc, diseaseName, location, status)
}
