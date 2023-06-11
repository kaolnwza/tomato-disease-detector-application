package model

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type ProviderType string

const (
	PROVIDER_TYPE_NORMAL    ProviderType = "normal"
	PROVIDER_TYPE_OAUTH2    ProviderType = "oauth2"
	PROVIDER_TYPE_LINE      ProviderType = "line"
	PROVIDER_TYPE_DEVICE_ID ProviderType = "device_id"
)

var ProviderTypeMap = map[string]ProviderType{
	"oauth2":    PROVIDER_TYPE_OAUTH2,
	"device_id": PROVIDER_TYPE_DEVICE_ID,
}

type UserProviderDB struct {
	UserProviderUUID uuid.UUID      `db:"user_provider_uuid" json:"user_provider_uuid"`
	UserUUID         uuid.UUID      `db:"user_uuid" json:"user_uuid"`
	ProviderID       sql.NullString `db:"provider_id" json:"provider_id"`
	ProviderType     ProviderType   `db:"token_type" json:"token_type"`
	Token            sql.NullString `db:"token" json:"token"`
	User             *User          `db:"user" json:"user"`
	Email            sql.NullString `db:"email" json:"email"`
	Password         sql.NullString `db:"password" json:"password"`
	CreatedAt        time.Time      `db:"created_at" json:"created_at"`
}

type UserProvider struct {
	UserProviderUUID uuid.UUID    `db:"user_provider_uuid" json:"user_provider_uuid"`
	UserUUID         uuid.UUID    `db:"user_uuid" json:"user_uuid"`
	ProviderID       string       `db:"provider_id" json:"provider_id"`
	ProviderType     ProviderType `db:"token_type" json:"token_type"`
	Token            string       `db:"token" json:"token"`
	User             *User        `db:"user" json:"user"`
	Email            string       `db:"email" json:"email"`
	Password         string       `db:"password" json:"password"`
	CreatedAt        time.Time    `db:"created_at" json:"created_at"`
}
