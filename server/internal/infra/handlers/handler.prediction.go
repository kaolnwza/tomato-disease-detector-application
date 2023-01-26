package handler

import (
	"net/http"
	repo "tomato-api/internal/core/repositories"
	log "tomato-api/lib/logs"
)

type predictionHandler struct {
	predSvc repo.PredictionService
}

func NewPredictionHandler(svc repo.PredictionService) predictionHandler {
	return predictionHandler{predSvc: svc}
}

func (h predictionHandler) PredictionTomato(c repo.Context) {
	file, fileHeader, err := c.Request().FormFile("file")
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	defer file.Close()

	disease, err := h.predSvc.PredictTomato(c.Ctx(), file, fileHeader)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, disease)
}
