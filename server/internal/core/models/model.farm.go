package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type Farm struct {
	FarmUUID     uuid.UUID      `db:"farm_uuid"`
	FarmName     string         `db:"farm_name"`
	FarmLocation sql.NullString `db:"farm_location"`
	IsActive     bool           `db:"is_active"`
	CreatedAt    time.Time      `db:"created_at"`
}

type FarmResponse struct {
	FarmUUID     uuid.UUID     `json:"farm_uuid"`
	FarmName     string        `json:"farm_name"`
	CreatedAt    time.Time     `json:"created_at"`
	FarmLocation []*LineString `json:"farm_location"`
}
