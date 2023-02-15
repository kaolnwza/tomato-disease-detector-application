package port

import (
	"context"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type UserFarmRepository interface {
	FetchUserFarmInfo(ctx context.Context, user *model.UserFarm, userUUID uuid.UUID, farmUUID uuid.UUID) error
	GetAll(ctx context.Context, users *[]*model.UserFarm, farmUUID uuid.UUID) error
	AddUserFarm(ctx context.Context, farmUUID uuid.UUID, newUserUUID uuid.UUID, role model.UserFarmRole) error
	UpdateUserFarmRole(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, role model.UserFarmRole) error
	ActivateUserFarm(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, status bool) error
}

type UserFarmService interface {
	FetchUserFarmInfo(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) (*model.UserFarm, error)
	IsUserFarmOwner(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) (*bool, error)
	GetAll(ctx context.Context, farmUUID uuid.UUID) (*[]*model.UserFarm, error)
	AddUserFarm(ctx context.Context, farmUUID uuid.UUID, newUserUUID uuid.UUID, role string) error
	UpdateUserFarmRole(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, role string) error
	ActivateUserFarm(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, status bool) error
}
