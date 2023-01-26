package handler

import (
	"net/http"
	"os"
	repo "tomato-api/internal/core/repositories"
	log "tomato-api/lib/logs"
)

type uploadHandler struct {
	uploadSvc repo.UploadService
}

func NewUploadHandler(svc repo.UploadService) uploadHandler {
	return uploadHandler{uploadSvc: svc}
}

func (h *uploadHandler) UploadFile(c repo.Context) {
	file, _, err := c.Request().FormFile("file")
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	defer file.Close()

	upload, err := h.uploadSvc.Upload(c.Ctx(), c.AccessUserUUID(), file, os.Getenv("GCS_BUCKET_1"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, upload)
}
