package redisdb

import (
	"os"

	"github.com/go-redis/redis/v8"
)

func NewRedisServer() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
}
