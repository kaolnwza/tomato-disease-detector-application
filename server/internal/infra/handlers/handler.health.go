package handler

import port "tomato-api/internal/ports"

type healthHdr struct {
}

func NewHealthHandler() healthHdr {
	return healthHdr{}
}

func (h *healthHdr) HealthCheck(c port.Context) {
	c.JSON(200, "okkub")
}
