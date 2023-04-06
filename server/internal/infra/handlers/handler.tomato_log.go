package handler

import (
	"errors"
	"net/http"
	"os"
	"strconv"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
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
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	diseases := c.QueryParam("disease_name")
	startTime, err := helper.TimeFormatRFC3339(c.QueryParam("start_time"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	endTime, err := helper.TimeFormatRFC3339(c.QueryParam("end_time"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	logs, err := h.tlSvc.GetByFarmUUID(c.Ctx(), farmUUID, c.AccessUserUUID(), startTime, endTime, diseases)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, logs)
}

// func (h *tomatoLogHandler) GetTomatoLogByUserUUID(c port.Context) {
// 	userUUID := c.AccessUserUUID()
// 	if userUUID == uuid.Nil {
// 		log.Error(fmt.Errorf("user_uuid is nil"))
// 		c.JSON(http.StatusInternalServerError, fmt.Errorf("user_uuid is nil"))
// 		return
// 	}

// 	farmUUID

// 	logs, err := h.tlSvc.GetByUserUUID(c.Ctx(), userUUID)
// 	if err != nil {
// 		log.Error(err)
// 		c.JSON(http.StatusInternalServerError, err.Error())
// 		return
// 	}

// 	c.JSON(http.StatusOK, logs)
// }

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
	score, err := strconv.ParseFloat(c.Request().FormValue("score"), 2)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := h.tlSvc.Create(c.Ctx(), userUUID, farmUUID, description, disease, file, os.Getenv("GCS_BUCKET_1"), latitude, longtitude, score); err != nil {
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

func (h *tomatoLogHandler) GetClusterByFarmUUIDHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	startTime := c.FormValue("start_time")
	endTime := c.FormValue("end_time")
	diseaseName := c.FormValue("disease_name")

	resp, err := h.tlSvc.GetClusterByFarmUUID(c.Ctx(), farmUUID, startTime, endTime, diseaseName)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *tomatoLogHandler) GetLogsPercentageByFarmUUIDHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	startTime := c.FormValue("start_time")
	endTime := c.FormValue("end_time")

	resp, err := h.tlSvc.GetLogsPercentageByFarmUUID(c.Ctx(), farmUUID, startTime, endTime)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *tomatoLogHandler) GetLogsPercentageDailyByFarmUUIDHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	startTime := c.Request().URL.Query().Get("start_time")
	endTime := c.Request().URL.Query().Get("end_time")

	resp, err := h.tlSvc.GetLogsPercentageDailyByFarmUUID(c.Ctx(), farmUUID, startTime, endTime)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *tomatoLogHandler) UpdateLogStatusByLogUUIDHandler(c port.Context) {
	logUUID, err := uuid.Parse(c.Param("log_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	status, ok := model.LogStatusToType[c.FormValue("status")]
	if !ok {
		err := errors.New("log status not matching")
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err := h.tlSvc.UpdateLogStatusByLogUUID(c.Ctx(), logUUID, status); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, nil)
}