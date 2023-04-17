package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"

	"github.com/google/uuid"
)

type usrFarmHdr struct {
	svc     port.UserFarmService
	userSvc port.UserService
}

func NewUserFarmHandler(svc port.UserFarmService, userSvc port.UserService) usrFarmHdr {
	return usrFarmHdr{svc: svc, userSvc: userSvc}
}

func (h *usrFarmHdr) FetchFarmRoleHandler(c port.Context) {
	userUUID := c.AccessUserUUID()
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.svc.FetchUserFarmInfo(c.Ctx(), userUUID, farmUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, map[string]model.UserFarmRole{
		"role": user.UserFarmRole,
	})

}

func (h *usrFarmHdr) GetAllFarmUserHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	offset := 0
	offsetStr := c.FormValue("offset")
	if offsetStr != "" {
		offset, err = strconv.Atoi(offsetStr)
		if err != nil {
			log.Error(err)
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}

	limit := 10
	limitStr := c.FormValue("limit")
	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			log.Error(err)
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}

	farm, err := h.svc.GetAll(c.Ctx(), farmUUID, limit, offset)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, farm)
}

func (h *usrFarmHdr) AddUserFarmHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	memberID := c.FormValue("member_id")
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	user, err := h.userSvc.GetUserByMemberID(c.Ctx(), memberID)
	if err != nil {
		log.Error(err)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNoContent, "user not found")
			return
		}

		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	role := c.FormValue("user_farm_role")

	accessUUID := c.AccessUserUUID()
	isOwner, err := h.svc.IsUserFarmOwner(c.Ctx(), accessUUID, farmUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if !*isOwner {
		err := fmt.Errorf("no permission to access this content")
		log.Error(err)
		c.JSON(http.StatusForbidden, err.Error())
		return

	}

	if err := h.svc.AddUserFarm(c.Ctx(), farmUUID, user.UserUUID, role); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *usrFarmHdr) UpdateUserFarmRoleHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	userUUID, err := uuid.Parse(c.Param("user_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	role := c.FormValue("user_farm_role")
	accessUUID := c.AccessUserUUID()

	isOwner, err := h.svc.IsUserFarmOwner(c.Ctx(), accessUUID, farmUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if !*isOwner {
		err := fmt.Errorf("no permission to access this content")
		log.Error(err)
		c.JSON(http.StatusForbidden, err.Error())
		return

	}

	if err := h.svc.UpdateUserFarmRole(c.Ctx(), farmUUID, userUUID, role); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}

func (h *usrFarmHdr) ActivateUserFarmHandler(c port.Context) {
	farmUUID, err := uuid.Parse(c.Param("farm_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	userUUID, err := uuid.Parse(c.Param("user_uuid"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	status, err := strconv.ParseBool(c.FormValue("status"))
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	accessUUID := c.AccessUserUUID()
	isOwner, err := h.svc.IsUserFarmOwner(c.Ctx(), accessUUID, farmUUID)
	if err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if !*isOwner {
		err := fmt.Errorf("no permission to access this content")
		log.Error(err)
		c.JSON(http.StatusForbidden, err.Error())
		return

	}

	if err := h.svc.ActivateUserFarm(c.Ctx(), farmUUID, userUUID, status); err != nil {
		log.Error(err)
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, nil)
}
