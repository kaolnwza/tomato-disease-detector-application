package pgsql

import (
	"context"
	"time"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

type tomatoLogRepo struct {
	tx port.Transactor
}

func NewTomatoLogRepo(tx port.Transactor) port.TomatoLogRepository {
	return &tomatoLogRepo{tx: tx}
}

func (r *tomatoLogRepo) GetByFarmUUID(ctx context.Context, log *[]*model.TomatoLog, farmUUID uuid.UUID, disease []model.TomatoDiseaseName) error {
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
			status,
			score
		FROM tomato_log
		LEFT JOIN upload ON upload.upload_uuid = tomato_log.upload_uuid
		LEFT JOIN tomato_disease_info ON tomato_disease_info.disease_uuid = tomato_disease_uuid
		WHERE EXISTS (
			SELECT 1 
			FROM farm_plot
			WHERE farm_uuid = $1
			AND farm_plot.farm_plot_uuid = tomato_log.farm_plot_uuid
		) 
		AND disease_name = ANY ($2)
		ORDER BY created_at DESC
 `

	return r.tx.Get(ctx, log, query, farmUUID.String(), pq.Array(disease))
}

func (r *tomatoLogRepo) GetByFarmUUIDWithTime(ctx context.Context, log *[]*model.TomatoLog, farmUUID uuid.UUID, startTime *time.Time, endTime *time.Time, diseaseList []model.TomatoDiseaseName) error {
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
			status,
			score
		FROM tomato_log
		LEFT JOIN upload ON upload.upload_uuid = tomato_log.upload_uuid
		LEFT JOIN tomato_disease_info ON tomato_disease_info.disease_uuid = tomato_disease_uuid
		WHERE EXISTS (
			SELECT 1 
			FROM farm_plot
			WHERE farm_uuid = $1
			AND farm_plot.farm_plot_uuid = tomato_log.farm_plot_uuid
		) 
	
		AND tomato_log.created_at BETWEEN $2 AND $3 
		AND disease_name = ANY ($4)
		ORDER BY created_at DESC
 `

	return r.tx.Get(ctx, log, query, farmUUID.String(), startTime, endTime, pq.Array(diseaseList))
}

func (r *tomatoLogRepo) GetByUserUUID(ctx context.Context, log *[]*model.TomatoLog, userUUID uuid.UUID, farmUUID uuid.UUID) error {
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
		AND EXISTS (
			SELECT 1 
			FROM farm_plot
			WHERE farm_uuid = $2
			AND farm_plot.farm_plot_uuid = tomato_log.farm_plot_uuid
		)
		ORDER BY created_at DESC
 `

	return r.tx.Get(ctx, log, query, userUUID.String(), farmUUID)
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
	score float64,
) error {
	query := `
		INSERT INTO tomato_log (recorder_uuid, farm_plot_uuid, upload_uuid, tomato_disease_uuid, description, location, status, score)
		SELECT 
			$1, 
			(SELECT farm_plot_uuid FROM farm_plot WHERE farm_uuid = $2 LIMIT 1), 
			$3,
			(SELECT disease_uuid FROM tomato_disease_info WHERE disease_name = $4), 
			$5, 
			$6,
			$7,
			$8
`

	return r.tx.Insert(ctx, query, logs.RecorderUUID.String(), farmUUID.String(), logs.UploadUUID.String(), diseaseName, logs.Description, location, status, score)
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

func (r *tomatoLogRepo) GetClusterByFarmUUID(ctx context.Context, logs *[]*model.TomatoSummary, farmUUID uuid.UUID, condition map[string]string) error {
	dateCond := ``
	if condition["start_time"] != "" && condition["end_time"] != "" {
		dateCond = `
		AND created_at BETWEEN '` + condition["start_time"] + `' AND '` + condition["end_time"] + `' `
	}

	diseaseCond := ``
	if condition["disease_name"] != "" {
		diseaseCond += `
		AND EXISTS (
			SELECT 1
			FROM tomato_disease_info
			WHERE disease_uuid = tomato_disease_uuid
			AND disease_name = '` + condition["disease_name"] + `'
		) `
	}

	query := `
	WITH all_logs AS (
		SELECT *
		FROM tomato_log
		WHERE farm_plot_uuid = (
			SELECT farm_plot_uuid
			FROM farm_plot
			WHERE farm_uuid = $1
		)
		AND "location" IS NOT NULL ` + dateCond + diseaseCond + `
	),
	freq AS (
		SELECT 
			ST_CLUSTERKMEANS(location, CASE WHEN (SELECT count(1) FROM all_logs) <= 3 THEN 1 ELSE 3 END) OVER() AS cid, 
			tomato_log_uuid, 
			"location",
			tomato_disease_uuid,
			status,
			created_at
		FROM all_logs
	),
	most_freq AS (
			SELECT cid FROM freq
			GROUP BY cid
			ORDER BY COUNT(1) DESC
			LIMIT 1
	),
	center_of_freq AS (
		SELECT 
			ST_AsGeoJSON(st_centroid(st_union("location")))::json->>'coordinates' AS center
		FROM freq
		WHERE EXISTS (
			SELECT 1 
			FROM most_freq
			WHERE most_freq.cid = freq.cid
			)
	)

	SELECT
		tomato_log_uuid, 
		(SELECT center FROM center_of_freq) "center_location",
		ST_AsGeoJSON("location")::json->>'coordinates' AS "location",
		disease_name,
		status,
		created_at
	FROM freq
	LEFT JOIN tomato_disease_info ON tomato_disease_uuid = disease_uuid
	-- WHERE EXISTS (
	-- 	SELECT 1 
	-- 	FROM most_freq
	-- 	WHERE most_freq.cid = freq.cid
	-- 	)
	`

	return r.tx.Get(ctx, logs, query, farmUUID)
}

func (r *tomatoLogRepo) GetLogsPercentageByFarmUUID(ctx context.Context, logs *[]*model.TomatoLogPercentage, farmUUID uuid.UUID, condition map[string]string) error {
	dateCond := ``
	if condition["start_time"] != "" && condition["end_time"] != "" {
		dateCond = `
		AND created_at BETWEEN '` + condition["start_time"] + `' AND '` + condition["end_time"] + `'`
	}

	query := `
	WITH disease AS (
		SELECT
			tomato_disease_uuid,
			status
		FROM tomato_log
		WHERE farm_plot_uuid = (
			SELECT farm_plot_uuid
			FROM farm_plot
			WHERE farm_uuid = $1
		)
		` + dateCond + `
	)
	
	SELECT 
		tomato_disease_uuid,
		disease_name,
		(SELECT 100.00/count(1) AS total_log FROM disease) * COUNT(1) log_percentage,
		COUNT(1) total_log,
		COUNT(1) FILTER(WHERE status = 'cured') total_cured,
		100 / CASE 
			WHEN COUNT(1) = 0 
			THEN 1
			ELSE COUNT(1) 
		END 
		*
		CASE 
			WHEN COUNT(1) FILTER(WHERE status = 'cured') = 0 
			THEN COUNT(1)
			ELSE COUNT(1) FILTER(WHERE status = 'cured') 
		END 
		disease_percentage,
		COALESCE(upload."path", '') AS path
	FROM disease
	LEFT JOIN tomato_disease_info ON tomato_disease_uuid = disease_uuid
	LEFT JOIN upload ON upload.upload_uuid = tomato_disease_info.upload_uuid
	GROUP BY tomato_disease_uuid, disease_name, upload."path"
	`

	return r.tx.Get(ctx, logs, query, farmUUID)
}

func (r *tomatoLogRepo) GetLogsPercentageDailyByFarmUUID(ctx context.Context, logs *[]*model.TomatoLogPercentage, farmUUID uuid.UUID, startDate string, endDate string) error {
	query := `
	WITH log AS (
		SELECT
			tomato_disease_uuid,
			status,
			created_at
		FROM tomato_log
		WHERE created_at BETWEEN $1 AND $2
		AND farm_plot_uuid = (
			SELECT farm_plot_uuid
			FROM farm_plot
			WHERE farm_uuid = $3
		)
	)
	
		SELECT
			created_at::date,
			COUNT(1) AS total_log,
			ROUND((100.00 / COUNT(1)) * COUNT(1) FILTER (WHERE status = 'disease')) disease_percentage
		FROM log
		GROUP BY created_at::date
		ORDER BY created_at::date 
	`

	return r.tx.Get(ctx, logs, query, startDate, endDate, farmUUID)
}

func (r *tomatoLogRepo) UpdateLogStatusByLogUUID(ctx context.Context, logUUID uuid.UUID, status model.TomatoLogStatus) error {
	query := `
		UPDATE tomato_log
		SET 
			status = $1,
			updated_at = now()
		WHERE tomato_log_uuid = $2
	`

	return r.tx.Update(ctx, query, status, logUUID)
}
