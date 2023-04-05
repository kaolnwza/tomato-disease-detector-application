package port

import (
	"context"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type TomatoDiseaseRepository interface {
	GetAll(context.Context, *[]*model.TomatoDisease) error
	GetByName(context.Context, string, *model.TomatoDisease) error
	Create(context.Context) error
	AddDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, uploadUUID []uuid.UUID, column string) error
	DeleteDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, imageUUID uuid.UUID) error
	UpdateDiseaseInfo(ctx context.Context, diseaseUUID uuid.UUID, column string, text string) error
	GetImagesByDiseaseUUID(ctx context.Context, diseaseUUID uuid.UUID, dest *[]*model.TomatoDiseaseImage) error
}

type TomatoDiseaseService interface {
	GetTomatoDiseases(context.Context) ([]*model.TomatoDiseaseResponse, error)
	GetTomatoDiseaseByName(context.Context, string) (*model.TomatoDiseaseResponse, error)
	CreateTomatoLog(context.Context) error
	AddDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, uploadUUIDs string, column string) error
	DeleteDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, imageUUID uuid.UUID) error
	UpdateDiseaseInfo(ctx context.Context, diseaseUUID uuid.UUID, column string, text string) error
	GetImagesByDiseaseUUID(ctx context.Context, diseaseUUID uuid.UUID) (*[]*model.TomatoDiseaseImageResponse, error)
}
