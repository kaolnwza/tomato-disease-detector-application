package model

import (
	"fmt"

	"github.com/google/uuid"
)

type RedisKey string

const (
	REDIS_TMT_DISEASE      RedisKey = "TMT_DISEASE"
	REDIS_TMT_DISEASE_UUID RedisKey = "TMT_DISEASE_UUID:%s"
	REDIS_TMT_DISEASE_NAME RedisKey = "TMT_DISEASE_NAME:%s"
)

func REDIS_TMT_DISEASE_UUID_MAP(diseaseUUID uuid.UUID) RedisKey {
	return RedisKey(fmt.Sprintf("TMT_DISEASE_UUID:%s", diseaseUUID))
}

func REDIS_TMT_DISEASE_NAME_MAP(diseaseUUID uuid.UUID) RedisKey {
	return RedisKey(fmt.Sprintf("TMT_DISEASE_NAME:%s", diseaseUUID))
}
