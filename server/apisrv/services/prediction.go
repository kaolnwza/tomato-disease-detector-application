package services

import (
	"encoding/json"
	model "tomato-api/apisrv/model"
	"tomato-api/lib/utils"

	"github.com/gin-gonic/gin"
)

func Prediction(c *gin.Context) {
	var img *model.Image
	if err := c.ShouldBindJSON(&img); err != nil {
		c.JSON(500, err.Error())
		return
	}

	if err := utils.Base64ToImg("../lib/tmp/", img.Image); err != nil {
		c.JSON(500, err.Error())
		return
	}

	byyt, err := json.Marshal(img)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	resp, err := utils.PostRequest(byyt)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	respStr, err := utils.BytesToString(*resp)
	if err != nil {
		c.JSON(500, err.Error())
		return
	}

	c.JSON(200, respStr)

}
