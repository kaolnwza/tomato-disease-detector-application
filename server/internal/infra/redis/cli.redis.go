package redisdb

import (
	"context"
	"encoding/json"
	"time"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/go-redis/redis/v8"
)

type redisDB struct {
	port.RedisDB
	cli *redis.Client
}

func NewRedisClient(cli *redis.Client) port.RedisDB {
	return redisDB{cli: cli}
}

func (r redisDB) SetValue(ctx context.Context, key model.RedisKey, value interface{}) error {
	byteValue, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.cli.Set(ctx, string(key), byteValue, time.Minute*5).Err()
}

func (r redisDB) GetValue(ctx context.Context, key model.RedisKey, dest interface{}) error {
	value, err := r.cli.Get(ctx, string(key)).Result()
	if err != nil {
		return err
	}

	return json.Unmarshal([]byte(value), &dest)
}

func (r redisDB) DeleteValue(ctx context.Context, key model.RedisKey) error {
	return r.cli.Del(ctx, string(key)).Err()
}

func (r redisDB) IsNil(err error) bool {
	return err == redis.Nil
}
