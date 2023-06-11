package service_test

import (
	"context"
	"testing"
	model "tomato-api/internal/core/models"
	service "tomato-api/internal/core/services"
	mocks "tomato-api/internal/infra/mock/repository"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestGetAllFarm(t *testing.T) {
	expect := []model.FarmResponse{{
		FarmName: "eiei",
		FarmLocation: []*model.LineString{
			{Latitude: "1.1", Longitude: "1.2"},
			{Latitude: "2.1", Longitude: "2.2"},
			{Latitude: "3.1", Longitude: "3.2"},
		},
	}}

	userUUIDMock := uuid.New()
	ctxMock := context.Background()

	txMock := mocks.NewTransactionMock()
	userFarmRepoMock := mocks.NewUserFarmRepositoryMock()
	farmRepoMock := mocks.NewFarmRepositoryMock()
	farmRepoMock.On("GetAll", ctxMock, userUUIDMock).Return([]model.Farm{
		{
			FarmName:     "eiei",
			FarmLocation: "[[1.1,1.2], [2.1,2.2], [3.1,3.2]]",
		},
	}, nil)

	farmSvc := service.NewFarmService(txMock, farmRepoMock, userFarmRepoMock)
	actual, err := farmSvc.GetAll(ctxMock, userUUIDMock)

	assert.NoError(t, err, "Should not Error")
	assert.Equal(t, expect[0].FarmName, actual[0].FarmName, "Should be same Name")
	assert.Equal(t, expect[0].FarmLocation, actual[0].FarmLocation, "Should be same Linestring")
}
