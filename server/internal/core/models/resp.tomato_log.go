package model

import (
	"time"

	"github.com/google/uuid"
)

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
	Location        string
}
