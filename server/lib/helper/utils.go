package helper

import (
	"encoding/json"
	model "tomato-api/internal/core/models"
)

func TomatoLogStatusVal(ds string, isCured bool) model.TomatoLogStatus {
	val := model.TOMATO_LOG_STATUS_UNDIFINED
	if isCured {
		return model.TOMATO_LOG_STATUS_CURED
	}

	if ds == "Healthy" {
		val = model.TOMATO_LOG_STATUS_HEALTHY
	} else {
		val = model.TOMATO_LOG_STATUS_DISEASE
	}

	return val
}

func JsonToStruct(jsonStr string, v interface{}) error {
	return json.Unmarshal([]byte(jsonStr), &v)
}

func StructCopy(base interface{}, dest interface{}) error {
	baseJson, err := json.Marshal(base)
	if err != nil {
		return err
	}

	return json.Unmarshal(baseJson, &dest)
}
