package handler

import (
	"net/http"
	"os"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"
)

type uploadHandler struct {
	uploadSvc port.UploadService
}

func NewUploadHandler(svc port.UploadService) uploadHandler {
	return uploadHandler{uploadSvc: svc}
}

func (h *uploadHandler) UploadFile(c port.Context) {
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
