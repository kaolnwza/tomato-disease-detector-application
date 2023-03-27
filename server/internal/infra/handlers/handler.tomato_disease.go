package handler

import (
	"net/http"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"

	"github.com/google/uuid"
)

type tomatoDiseaseHandler struct {
	tdsSvc port.TomatoDiseaseService
}

// type TomatoDiseaseHandler interface {
// 	GetTomatoDiseasesHandler() error
// }

func NewTomatoDiseaseHandler(svc port.TomatoDiseaseService) tomatoDiseaseHandler {
	return tomatoDiseaseHandler{tdsSvc: svc}
}

func (h *tomatoDiseaseHandler) GetTomatoDiseasesHandler(c port.Context) {
	// gcsCtx := appengine.NewContext(c.Request())

	disease, err := h.tdsSvc.GetTomatoDiseases(c.Ctx())
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, disease)
}

func (h *tomatoDiseaseHandler) GetTomatoDiseaseByNameHandler(c port.Context) {
	diseaseName := c.Param("name")

	resp, err := h.tdsSvc.GetTomatoDiseaseByName(c.Ctx(), diseaseName)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *tomatoDiseaseHandler) AddDiseaseImageHandler(c port.Context) {
	diseaseUUID, err := uuid.Parse(c.Param("disease_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	images := c.FormValue("images")

	if err := h.tdsSvc.AddDiseaseImage(c.Ctx(), diseaseUUID, images); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *tomatoDiseaseHandler) DeleteDiseaseImageHandler(c port.Context) {
	diseaseUUID, err := uuid.Parse(c.Param("disease_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	imageUUID, err := uuid.Parse(c.FormValue("image_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err := h.tdsSvc.DeleteDiseaseImage(c.Ctx(), diseaseUUID, imageUUID); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *tomatoDiseaseHandler) UpdateDiseaseInfoHandler(c port.Context) {
	diseaseUUID, err := uuid.Parse(c.Param("disease_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	column := c.FormValue("column")
	text := c.FormValue("text")

	if err := h.tdsSvc.UpdateDiseaseInfo(c.Ctx(), diseaseUUID, column, text); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}
