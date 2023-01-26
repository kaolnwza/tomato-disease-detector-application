package handler

import (
	"net/http"
	repo "tomato-api/internal/core/repositories"
	log "tomato-api/lib/logs"
)

type tomatoDiseaseHandler struct {
	tdsSvc repo.TomatoDiseaseService
}

// type TomatoDiseaseHandler interface {
// 	GetTomatoDiseasesHandler() error
// }

func NewTomatoDiseaseHandler(svc repo.TomatoDiseaseService) tomatoDiseaseHandler {
	return tomatoDiseaseHandler{tdsSvc: svc}
}

func (h *tomatoDiseaseHandler) GetTomatoDiseasesHandler(c repo.Context) {
	// gcsCtx := appengine.NewContext(c.Request())

	disease, err := h.tdsSvc.GetTomatoDiseases(c.Ctx())
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, disease)
}

// func (h tomatoDiseaseHandler) GetTomatoDiseasesHandler()

// func (h accountHandler) GetAccounts() {
// 	customerID, _ := strconv.Atoi(mux.Vars(r)["customerID"])

// 	responses, err := h.accSrv.GetAccounts(customerID)
// 	if err != nil {
// 		handleError(w, err)
// 		return
// 	}

// 	w.Header().Set("content-type", "application/json")
// 	json.NewEncoder(w).Encode(responses)
// }
