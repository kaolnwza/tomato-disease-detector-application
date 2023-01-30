package port

import (
	"context"
	model "tomato-api/internal/core/models"
)

type TomatoDiseaseRepository interface {
	GetAll(context.Context, *[]*model.TomatoDisease) error
	GetByName(context.Context, string, *model.TomatoDisease) error
	Create(context.Context) error
}

type TomatoDiseaseService interface {
	GetTomatoDiseases(context.Context) ([]*model.TomatoDiseaseResponse, error)
	GetTomatoDiseaseByName(context.Context, string) (*model.TomatoDiseaseResponse, error)
	CreateTomatoLog(context.Context) error
}
