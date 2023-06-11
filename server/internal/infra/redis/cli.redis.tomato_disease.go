package redisdb

import (
	"context"
	model "tomato-api/internal/core/models"
)

func (r redisDB) GetTomatoDiseasesCache(ctx context.Context) ([]*model.TomatoDiseaseResponse, error) {
	resp := make([]*model.TomatoDiseaseResponse, 0)
	err := r.GetValue(ctx, model.REDIS_TMT_DISEASE, &resp)

	return resp, err
}

func (r redisDB) GetTomatoDiseasesCacheByUUID(ctx context.Context, key model.RedisKey) ([]*model.TomatoDiseaseImageResponse, error) {
	resp := make([]*model.TomatoDiseaseImageResponse, 0)
	err := r.GetValue(ctx, model.REDIS_TMT_DISEASE, &resp)

	return resp, err
}
