package model

import (
	"time"

	uuid "github.com/satori/go.uuid"
)

type UserFarmRole string

const (
	USER_FARM_ROLE_OWNER    UserFarmRole = "owner"
	USER_FARM_ROLE_EMPLOYEE UserFarmRole = "employee"
)

type NewUserFarm struct {
	UserUUID     uuid.UUID    `db:"user_uuid"`
	FarmUUID     uuid.UUID    `db:"farm_uuid"`
	UserFarmRole UserFarmRole `db:"user_farm_role"`
}

type UserFarm struct {
	UserFarmUUID uuid.UUID    `db:"user_farm_uuid"`
	User         *User        `db:"user"`
	FarmUUID     uuid.UUID    `db:"farm_uuid"`
	UserFarmRole UserFarmRole `db:"user_farm_role"`
	IsActive     bool         `db:"is_active"`
	CreatedAt    time.Time    `db:"created_at"`
}

// type UserFarmInterface interface {
// 	// NewUserFarm(*sqlx.DB, *NewUserFarm) (*UserFarm, error)
// 	// GetUserFarmByFarmUUID(*sqlx.DB, uuid.UUID) (*UserFarm, error)
// 	// GetAllUsersByFarmUUID(*sqlx.DB, uuid.UUID) ([]*UserFarm, error)
// 	// GetAllUserFarm() ([]*UserFarm, error)
// 	GetAllUserFarm() ([]*UserFarm, error)
// }
