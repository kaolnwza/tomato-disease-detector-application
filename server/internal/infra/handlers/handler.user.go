package handler

import (
	"database/sql"
	"errors"
	"net/http"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"
	"tomato-api/lib/pkg"

	"github.com/google/uuid"
)

type userHandler struct {
	userSvc port.UserService
}

func NewUserHandler(svc port.UserService) *userHandler {
	return &userHandler{userSvc: svc}
}

func (h *userHandler) NewAccessToken(c port.Context) {
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

func (h *userHandler) GoogleLoginHandler(c port.Context) {
	// oauthInfo, err := pkg.GetGoogleCallbackInfo(c.Request().FormValue("oauth2_token"))
	// if err != nil {
	// 	log.Error(err)
	// 	// http.Redirect(c.Writer(), c.Request(), "/oauth/", http.StatusTemporaryRedirect)
	// 	c.JSON(http.StatusBadRequest, err.Error())
	// 	return
	// }

	email := c.FormValue("email")
	name := c.FormValue("name")
	authId := c.FormValue("auth_id")

	if email == "" {
		err := errors.New("email is empty")
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accessToken, role, err := h.userSvc.GoogleLogin(c.Ctx(), model.PROVIDER_TYPE_OAUTH2, authId, email, name)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	user, err := h.userSvc.GetUserByProviderID(c.Ctx(), model.PROVIDER_TYPE_OAUTH2, authId)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token": *accessToken,
		"role":         *role,
		"user":         &user,
	})
}

func (h *userHandler) DeviceLoginHandler(c port.Context) {
	device_id := c.FormValue("device_id")
	name := c.FormValue("name")

	if device_id == "" {
		err := errors.New("device_id is empty")
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accessToken, role, err := h.userSvc.DeviceLogin(c.Ctx(), model.PROVIDER_TYPE_DEVICE_ID, device_id, name)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	user, err := h.userSvc.GetUserByProviderID(c.Ctx(), model.PROVIDER_TYPE_DEVICE_ID, device_id)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"access_token": *accessToken,
		"role":         *role,
		"user":         &user,
	})

}

func (h userHandler) GetUserHandler(c port.Context) {
	userUUID := c.AccessUserUUID()
	user, err := h.userSvc.GetUserByUUID(c.Ctx(), userUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h userHandler) GetUserByMemberIDHandler(c port.Context) {
	memberID := c.Param("member_id")
	user, err := h.userSvc.GetUserByMemberID(c.Ctx(), memberID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h userHandler) GetUserByProviderID(c port.Context) {
	providerType, ok := model.ProviderTypeMap[c.Request().URL.Query().Get("provider_type")]
	if !ok {
		err := errors.New("type not found")
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	providerId := c.Request().URL.Query().Get("provider_id")

	user, err := h.userSvc.GetUserByProviderID(c.Ctx(), providerType, providerId)
	if err != nil {
		log.Error(err)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNoContent, nil)
			return
		}

		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	accessToken, _, err := pkg.GenerateToken(user.UserUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]interface{}{
		"user":         &user,
		"access_token": accessToken,
	})
}
