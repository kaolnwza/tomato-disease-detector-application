package handler

import (
	"net/http"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"
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
