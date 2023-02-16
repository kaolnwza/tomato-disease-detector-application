package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type User struct {
	UserUUID     uuid.UUID      `db:"user_uuid" json:"user_uuid"`
	FirstName    string         `db:"first_name" json:"first_name"`
	LastName     string         `db:"last_name" json:"last_name"`
	ProviderType ProviderType   `db:"token_type" json:"token_type"`
	Token        sql.NullString `db:"token" json:"token"`
	Email        sql.NullString `db:"email" json:"email"`
	Password     sql.NullString `db:"password" json:"password"`
}

type UserResponse struct {
	UserUUID  uuid.UUID `db:"user_uuid" json:"user_uuid"`
	FirstName string    `db:"first_name"`
	LastName  string    `db:"last_name"`
	CreatedAt time.Time `db:"created_at"`
}