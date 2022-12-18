package services

import (
	"net/http"
	"tomato-api/apisrv/model"
	"tomato-api/apisrv/repo"

	"github.com/gin-gonic/gin"
)

func GetDiseasesInfoHandler(c *gin.Context) {
	disease := []*model.TomatoDisease{}

	if err := repo.GetTomatoDisease(repo.DB, &disease); err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, disease)

}
