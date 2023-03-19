package handler

import (
	"net/http"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"

	"github.com/google/uuid"
)

type farmHdr struct {
	svc port.FarmService
}

func NewFarmHandler(svc port.FarmService) farmHdr {
	return farmHdr{svc: svc}
}

func (h *farmHdr) CreateFarmHandler(c port.Context) {
	userUUID := c.AccessUserUUID()
	farmName := c.FormValue("farm_name")
	location := c.FormValue("location")

	if err := h.svc.Create(c.Ctx(), farmName, userUUID, location); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *farmHdr) GetAllFarmHandler(c port.Context) {
	userUUID := c.AccessUserUUID()

	resp, err := h.svc.GetAll(c.Ctx(), userUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *farmHdr) DeleteFarmByUUIDHandler(c port.Context) {
	userUUID := c.AccessUserUUID()
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err := h.svc.DeleteFarmByUUID(c.Ctx(), userUUID, farmUUID); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, nil)
}

func (h *farmHdr) UpdateFarmByUUID(c port.Context) {
	userUUID := c.AccessUserUUID()
	farmName := c.FormValue("farm_name")
	location := c.FormValue("location")
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if err := h.svc.UpdateFarmByUUID(c.Ctx(), userUUID, farmUUID, farmName, location); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, nil)
}
