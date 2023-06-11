package mocks

import (
	"context"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
	"github.com/stretchr/testify/mock"
)

type farmRepoMock struct {
	mock.Mock
}

func NewFarmRepositoryMock() *farmRepoMock {
	return &farmRepoMock{}
}

func (m *farmRepoMock) Create(ctx context.Context, farmName string, userUUID uuid.UUID, location string) error {
	panic("unimplement")
}

func (m *farmRepoMock) GetAll(ctx context.Context, userUUID uuid.UUID) ([]model.Farm, error) {
	args := m.Called(ctx, userUUID)
	return args.Get(0).([]model.Farm), args.Error(1)
}

func (m *farmRepoMock) Update(ctx context.Context, farmUUID uuid.UUID, farmName string, location string) error {
	panic("unimplement")
}
func (m *farmRepoMock) Delete(ctx context.Context, farmUUID uuid.UUID) error {
	panic("unimplement")
}
func (m *farmRepoMock) GetByUUID(ctx context.Context, farmUUID uuid.UUID) (model.Farm, error) {
	panic("unimplement")
}

// func (m *tmtFarmRepoMock) GetByUUID() (model.Farm, error) {
// 	args := m.Called()
// 	return args.Get(0).(model.Farm), args.Error(1)
// }
