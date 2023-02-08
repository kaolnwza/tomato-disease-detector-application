package model

import (
	"database/sql"
	"time"

	uuid "github.com/google/uuid"
)

type TomatoLogStatus string

const (
	TOMATO_LOG_STATUS_DISEASE   TomatoLogStatus = "disease"
	TOMATO_LOG_STATUS_UNDIFINED TomatoLogStatus = "undifined"
	TOMATO_LOG_STATUS_HEALTHY   TomatoLogStatus = "healthy"
	TOMATO_LOG_STATUS_CURED     TomatoLogStatus = "cured"
)

var LogStatusToType = map[string]TomatoLogStatus{
	"disease":   TOMATO_LOG_STATUS_DISEASE,
	"undifined": TOMATO_LOG_STATUS_UNDIFINED,
	"cured":     TOMATO_LOG_STATUS_CURED,
	"healthy":   TOMATO_LOG_STATUS_HEALTHY,
}

type TomatoLog struct {
	TomatoLogUUID     uuid.UUID       `db:"tomato_log_uuid" json:"tomato_log_uuid"`
	FarmPlotUUID      uuid.UUID       `db:"farm_plot_uuid" json:"-"`
	RecorderUUID      uuid.UUID       `db:"recorder_uuid" json:"recorder_uuid"`
	TomatoDiseaseInfo *TomatoDisease  `db:"tomato_disease_info"`
	Description       sql.NullString  `db:"description" json:"description"`
	CreatedAt         time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt         time.Time       `db:"updated_at" json:"updated_at"`
	UploadUUID        uuid.UUID       `db:"upload_uuid" json:"upload_uuid"`
	UploadPath        string          `db:"upload_path" json:"-"`
	ImageURI          string          `json:"image_uri"`
	Location          sql.NullString  `db:"location"`
	Status            TomatoLogStatus `db:"status"`
}

type TomatoLogResponse struct {
	TomatoLogUUID   uuid.UUID `json:"tomato_log_uuid"`
	FarmPlotUUID    uuid.UUID `json:"-"`
	RecorderUUID    uuid.UUID `json:"recorder_uuid"`
	DiseaseName     string    `json:"disease_name"`
	DiseaseNameThai string    `json:"disease_name_th"`
	Description     *string   `json:"description"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	ImageURI        string    `json:"image_uri"`
	Latitude        string    `json:"latitude"`
	Longtitude      string    `json:"longtitude"`
	Status          string    `json:"string"`
}
