package model

import (
	"time"

	"github.com/google/uuid"
)

type UserResponse struct {
	UserUUID  uuid.UUID `db:"user_uuid" json:"user_uuid"`
	FirstName string    `db:"first_name"`
	LastName  string    `db:"last_name"`
	CreatedAt time.Time `db:"created_at"`
}
