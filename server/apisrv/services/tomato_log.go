package services

import (
	"net/http"
	"os"
	"sync"
	"tomato-api/apisrv/model"
	"tomato-api/apisrv/repo"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func FetchTomatoLogByUserUUIDHandler(c *gin.Context) {
	userUUID, ok := c.Request.Context().Value("access_user_uuid").(uuid.UUID)
	if !ok {
		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}

	log := []*model.TomatoLog{}
	if err := repo.FetchTomatoLogByUserUUID(repo.DB, &log, userUUID); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	var wg sync.WaitGroup

	for _, i := range log {
		wg.Add(1)
		go func(i *model.TomatoLog) {
			defer wg.Done()

			uri, err := GenerateImageURI(c, os.Getenv("GCS_BUCKET_1"), i.UploadPath)
			if err != nil {
				c.JSON(http.StatusInternalServerError, err.Error())
				return
			}

			i.ImageURI = uri

		}(i)
	}

	wg.Wait()

	c.JSON(200, log)
}

func CreateTomatoLogHandler(c *gin.Context) {
	userUUID, ok := c.Request.Context().Value("access_user_uuid").(uuid.UUID)
	if !ok {
		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}

	desc := c.Request.FormValue("description")
	disease := c.Request.FormValue("disease")

	tx, err := repo.DB.Beginx()
	upload, err := FileUploadToBucketByImage(c, userUUID, tx)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := repo.CreateTomatoLog(tx, desc, disease, upload.UUID, userUUID); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		c.JSON(500, err.Error())
		return
	}

	c.JSON(200, nil)

}
