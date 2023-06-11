package port

import (
	"context"
	model "tomato-api/internal/core/models"
)

type RedisDB interface {
	SetValue(ctx context.Context, key model.RedisKey, value interface{}) error
	GetValue(ctx context.Context, key model.RedisKey, dest interface{}) error
	IsNil(err error) bool
	DeleteValue(ctx context.Context, key model.RedisKey) error

	GetTomatoDiseasesCache(ctx context.Context) ([]model.TomatoDiseaseResponse, error)
	GetTomatoDiseasesCacheByUUID(ctx context.Context, key model.RedisKey) ([]model.TomatoDiseaseImageResponse, error)
}
