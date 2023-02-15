package model

import (
	"time"

	"github.com/google/uuid"
)

type UserFarmRole string

const (
	USER_FARM_ROLE_OWNER    UserFarmRole = "owner"
	USER_FARM_ROLE_EMPLOYEE UserFarmRole = "employee"
)

var UserFarmRoleMap = map[string]UserFarmRole{
	"owner":    USER_FARM_ROLE_OWNER,
	"employee": USER_FARM_ROLE_EMPLOYEE,
}

type UserFarm struct {
	UserFarmUUID uuid.UUID    `db:"user_farm_uuid" json:"user_farm_uuid"`
	UserUUID     uuid.UUID    `db:"user_uuid" json:"user_uuid"`
	FarmUUID     uuid.UUID    `db:"farm_uuid" json:"-"`
	UserFarmRole UserFarmRole `db:"user_farm_role" json:"user_farm_role"`
	IsActive     bool         `db:"-" json:"-"`
	CreatedAt    time.Time    `db:"created_at" json:"created_at"`
}
