package helper

import model "tomato-api/internal/core/models"

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
