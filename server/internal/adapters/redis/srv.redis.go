package redisdb

import (
	"fmt"
	"os"

	"github.com/go-redis/redis/v8"
)

func NewRedisServer() *redis.Client {
	opts, err := redis.ParseURL(os.Getenv("REDIS_URL"))
	if err != nil {
		fmt.Println("------------err", err.Error())
	}

	return redis.NewClient(opts)

}
