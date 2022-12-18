package services

import (
	"encoding/json"
	"net/http"
	model "tomato-api/apisrv/model"
	"tomato-api/lib/utils"

	"github.com/gin-gonic/gin"
)

func PredictionByBase64(c *gin.Context) {
	var img *model.Image
	if err := c.ShouldBindJSON(&img); err != nil {
		c.JSON(500, err.Error())
		return
	}

	// if err := utils.Base64ToImg("../lib/tmp/", img.Image); err != nil {
	// 	c.JSON(500, err.Error())
	// 	return
	// }

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

func Prediction(c *gin.Context) {
	// userUUID, ok := c.Request.Context().Value("access_user_uuid").(uuid.UUID)
	// if !ok {
	// 	c.Status(http.StatusInternalServerError)
	// 	c.Abort()
	// 	return
	// }

	file, fileHeader, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	// tx, err := repo.DB.Beginx()
	// upload, err := FileUploadToBucketByImage(c, userUUID, tx)
	// if err != nil {
	// 	// tx.Rollback()
	// 	c.JSON(http.StatusInternalServerError, err.Error())
	// 	return
	// }

	resp, err := utils.PostRequestImage(file, fileHeader)
	if err != nil {
		// tx.Rollback()
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	respStr, err := utils.BytesToString(*resp)
	if err != nil {
		// tx.Rollback()
		c.JSON(500, err.Error())
		return
	}

	// if err := tx.Commit(); err != nil {
	// 	tx.Rollback()
	// 	c.JSON(500, err.Error())
	// 	return
	// }

	c.JSON(http.StatusOK, respStr)

}
