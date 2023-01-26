package model

import (
	"time"

	"github.com/google/uuid"
)

type Upload struct {
	UUID      uuid.UUID `db:"uuid" json:"uuid"`
	UserUUID  uuid.UUID `db:"user_uuid" json:"user_uuid"`
	Bucket    string    `db:"bucket" json:"bucket"`
	Path      string    `db:"path" json:"path"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}
