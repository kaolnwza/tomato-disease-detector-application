package mocks

import (
	"context"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type userFarmRepoMock struct {
	mock.Mock
}

func NewUserFarmRepositoryMock() *userFarmRepoMock {
	return &userFarmRepoMock{}
}

func (m *userFarmRepoMock) FetchUserFarmInfo(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) (model.UserFarm, error) {
	panic("unimplement")
}
func (m *userFarmRepoMock) GetAll(ctx context.Context, farmUUID uuid.UUID, limit int, offset int) ([]model.UserFarm, error) {
	panic("unimplement")
}
func (m *userFarmRepoMock) AddUserFarm(ctx context.Context, farmUUID uuid.UUID, newUserUUID uuid.UUID, role model.UserFarmRole) error {
	panic("unimplement")
}
func (m *userFarmRepoMock) UpdateUserFarmRole(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, role model.UserFarmRole) error {
	panic("unimplement")
}
func (m *userFarmRepoMock) ActivateUserFarm(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, status bool) error {
	panic("unimplement")
}
