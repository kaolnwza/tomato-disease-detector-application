package service

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	uuid "github.com/google/uuid"
)

type usrFarmSvc struct {
	tx          port.Transactor
	usrFarmRepo port.UserFarmRepository
}

func NewUserFarmService(tx port.Transactor, usrFarmRepo port.UserFarmRepository) port.UserFarmService {
	return &usrFarmSvc{tx: tx, usrFarmRepo: usrFarmRepo}
}

func (s *usrFarmSvc) FetchUserFarmInfo(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) (*model.UserFarm, error) {
	user := model.UserFarm{}

	if err := s.usrFarmRepo.FetchUserFarmInfo(ctx, &user, userUUID, farmUUID); err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *usrFarmSvc) IsUserFarmOwner(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) (*bool, error) {
	user := model.UserFarm{}

	if err := s.usrFarmRepo.FetchUserFarmInfo(ctx, &user, userUUID, farmUUID); err != nil {
		return nil, err
	}

	isOwer := user.UserFarmRole == model.USER_FARM_ROLE_OWNER

	return &isOwer, nil
}

func (s *usrFarmSvc) GetAll(ctx context.Context, farmUUID uuid.UUID) (*[]*model.UserFarm, error) {
	users := make([]*model.UserFarm, 0)
	if err := s.usrFarmRepo.GetAll(ctx, &users, farmUUID); err != nil {
		return nil, err
	}

	return &users, nil
}

func (s *usrFarmSvc) AddUserFarm(ctx context.Context, farmUUID uuid.UUID, newUserUUID uuid.UUID) error {
	if err := s.usrFarmRepo.AddUserFarm(ctx, farmUUID, newUserUUID); err != nil {
		return err
	}

	return nil
}

func (s *usrFarmSvc) UpdateUserFarmRole(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, role string) error {
	parseRole := model.UserFarmRoleMap[role]
	if err := s.usrFarmRepo.UpdateUserFarmRole(ctx, farmUUID, userUUID, parseRole); err != nil {
		return err
	}

	return nil
}

func (s *usrFarmSvc) ActivateUserFarm(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, status bool) error {
	if err := s.usrFarmRepo.ActivateUserFarm(ctx, farmUUID, userUUID, status); err != nil {
		return err
	}

	return nil
}
