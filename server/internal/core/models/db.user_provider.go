package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type ProviderType string

const (
	PROVIDER_TYPE_NORMAL ProviderType = "normal"
	PROVIDER_TYPE_OAUTH2 ProviderType = "oauth2"
	PROVIDER_TYPE_LINE   ProviderType = "line"
)

type UserProvider struct {
	UserProviderUUID uuid.UUID      `db:"user_provider_uuid"`
	UserUUID         uuid.UUID      `db:"user_uuid" json:"user_uuid"`
	ProviderID       sql.NullString `db:"provider_id"`
	ProviderType     ProviderType   `db:"token_type"`
	Token            sql.NullString `db:"token"`
	User             *User          `db:"user"`
	Email            sql.NullString `db:"email"`
	Password         sql.NullString `db:"password"`
	CreatedAt        time.Time      `db:"created_at"`
}
