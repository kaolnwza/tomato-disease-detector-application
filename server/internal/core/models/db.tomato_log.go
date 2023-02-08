package model

import (
	"database/sql"
	"time"

	uuid "github.com/google/uuid"
)

type TomatoLog struct {
	TomatoLogUUID uuid.UUID `db:"tomato_log_uuid" json:"tomato_log_uuid"`
	FarmPlotUUID  uuid.UUID `db:"farm_plot_uuid" json:"-"`
	RecorderUUID  uuid.UUID `db:"recorder_uuid" json:"recorder_uuid"`
	// TomatoDiseaseUUID uuid.UUID      `db:"tomato_disease_uuid" json:"tomato_disease_uuid"`
	TomatoDiseaseInfo *TomatoDisease `db:"tomato_disease_info"`
	Description       sql.NullString `db:"description" json:"description"`
	CreatedAt         time.Time      `db:"created_at" json:"created_at"`
	UpdatedAt         time.Time      `db:"updated_at" json:"updated_at"`
	UploadUUID        uuid.UUID      `db:"upload_uuid" json:"upload_uuid"`
	UploadPath        string         `db:"upload_path" json:"-"`
	ImageURI          string         `json:"image_uri"`
	Location          sql.NullString `db:"location"`
}
