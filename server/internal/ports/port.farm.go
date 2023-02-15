package port

import (
	"context"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type FarmRepository interface {
	Create(ctx context.Context, farmName string, userUUID uuid.UUID, location string) error
	GetAll(ctx context.Context, farm *[]*model.Farm, userUUID uuid.UUID) error
	// Update(ctx context.Context, farmUUID uuid.UUID, location string) error
}

type FarmService interface {
	Create(ctx context.Context, farmName string, userUUID uuid.UUID, linestring string) error
	GetAll(ctx context.Context, userUUID uuid.UUID) (*[]*model.FarmResponse, error)
	// GetFarmByUUID(context.Context, uuid.UUID) (*model.Farm, error)
	// CreateFarm(context.Context, uuid.UUID, string, string) error
}
