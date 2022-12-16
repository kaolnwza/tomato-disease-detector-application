package model

import (
	"database/sql"
	"time"

	uuid "github.com/satori/go.uuid"
)

type TokenType string

const (
	TOKEN_TYPE_NORMAL TokenType = "normal"
	TOKEN_TYPE_OAUTH2 TokenType = "oauth2"
	TOKEN_TYPE_LINE   TokenType = "line"
)

type NewUser struct {
	FirstName string         `db:"first_name"`
	LastName  string         `db:"last_name"`
	TokenType TokenType      `db:"token_type"`
	Token     sql.NullString `db:"token"`
	Email     sql.NullString `db:"email"`
	Password  sql.NullString `db:"password"`
}

type UserToken struct {
	UserTokenUUID uuid.UUID      `db:"user_token_uuid"`
	TokenType     TokenType      `db:"token_type"`
	Token         sql.NullString `db:"token"`
	User          *User          `db:"user"`
	Email         sql.NullString `db:"email"`
	Password      sql.NullString `db:"password"`
	CreatedAt     time.Time      `db:"created_at"`
}

type User struct {
	UserUUID  uuid.UUID `db:"user_uuid" json:"user_uuid"`
	FirstName string    `db:"first_name"`
	LastName  string    `db:"last_name"`
	CreatedAt time.Time `db:"created_at"`
}

type UserInterface interface {
}
