package handler

import (
	"fmt"
	"net/http"
	"os"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"

	"github.com/google/uuid"
)

type tomatoLogHandler struct {
	tlSvc port.TomatoLogService
}

func NewTomatoLogHandler(svc port.TomatoLogService) *tomatoLogHandler {
	return &tomatoLogHandler{tlSvc: svc}
}

func (h *tomatoLogHandler) GetTomatoLogByFarmUUID(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	logs, err := h.tlSvc.GetByFarmUUID(c.Ctx(), farmUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, logs)
}

func (h *tomatoLogHandler) GetTomatoLogByUserUUID(c port.Context) {
	userUUID := c.AccessUserUUID()
	if userUUID == uuid.Nil {
		log.Error(fmt.Errorf("user_uuid is nil"))
		c.JSON(http.StatusInternalServerError, fmt.Errorf("user_uuid is nil"))
		return
	}

	logs, err := h.tlSvc.GetByUserUUID(c.Ctx(), userUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, logs)
}

func (h *tomatoLogHandler) GetTomatoLogByLogUUID(c port.Context) {
	logUUID, err := uuid.Parse(c.Param("log_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	logs, err := h.tlSvc.GetByLogUUID(c.Ctx(), logUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, logs)
}

func (h *tomatoLogHandler) CreateTomatoLogByFarmUUID(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	file, _, err := c.Request().FormFile("file")
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	defer file.Close()

	description := c.Request().FormValue("description")
	disease := c.Request().FormValue("disease")
	latitude := c.Request().FormValue("latitude")
	longtitude := c.Request().FormValue("longtitude")
	userUUID := c.AccessUserUUID()

	if err := h.tlSvc.Create(c.Ctx(), userUUID, farmUUID, description, disease, file, os.Getenv("GCS_BUCKET_1"), latitude, longtitude); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *tomatoLogHandler) UpdateByLogUUIDHandler(c port.Context) {
	logUUID, err := uuid.Parse(c.Param("log_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	description := c.Request().FormValue("description")
	disease := c.Request().FormValue("disease")
	latitude := c.Request().FormValue("latitude")
	longtitude := c.Request().FormValue("longtitude")
	status := c.Request().FormValue("status")

	if err := h.tlSvc.UpdateByLogUUID(c.Ctx(), logUUID, description, disease, status, latitude, longtitude); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, nil)
}
