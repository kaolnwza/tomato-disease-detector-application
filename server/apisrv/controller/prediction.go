package controller

import (
	"tomato-api/apisrv/services"

	"github.com/gin-gonic/gin"
)

func predictionController(ru *gin.Engine) {
	r := ru.Group("/v1")
	{
		r.POST("/prediction", services.Prediction)
	}
}
