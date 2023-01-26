package handler

import (
	"net/http"
	model "tomato-api/internal/core/models"
	repo "tomato-api/internal/core/repositories"
	log "tomato-api/lib/logs"
	"tomato-api/lib/pkg"

	"github.com/google/uuid"
)

type userHandler struct {
	userSvc repo.UserService
}

func NewUserHandler(svc repo.UserService) *userHandler {
	return &userHandler{userSvc: svc}
}

func (h *userHandler) NewAccessToken(c repo.Context) {
	userUUID, err := uuid.Parse(c.Param("user_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	at, _, err := pkg.GenerateToken(userUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, at)
}

func (h *userHandler) GoogleLoginHandler(c repo.Context) {
	oauthInfo, err := pkg.GetGoogleCallbackInfo(c.Request().FormValue("oauth2_token"))
	if err != nil {
		log.Error(err)
		// http.Redirect(c.Writer(), c.Request(), "/oauth/", http.StatusTemporaryRedirect)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accessToken, err := h.userSvc.GoogleLogin(c.Ctx(), model.PROVIDER_TYPE_OAUTH2, oauthInfo.ID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, &accessToken)

}
