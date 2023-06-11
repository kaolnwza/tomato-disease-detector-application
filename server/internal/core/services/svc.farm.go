package service

import (
	"context"
	"errors"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"

	uuid "github.com/google/uuid"
)

type farmSvc struct {
	tx          port.Transactor
	farmRepo    port.FarmRepository
	usrFarmRepo port.UserFarmRepository
}

func NewFarmService(tx port.Transactor, farmRepo port.FarmRepository, usrFarmRepo port.UserFarmRepository) port.FarmService {
	return &farmSvc{tx: tx, farmRepo: farmRepo, usrFarmRepo: usrFarmRepo}
}

func (s *farmSvc) Create(ctx context.Context, farmName string, userUUID uuid.UUID, jsonStr string) error {
	location := "NULL"
	if jsonStr != "" {
		linestring := []*model.LineStringFloat{}
		if err := helper.JsonToStruct(jsonStr, &linestring); err != nil {
			return err
		}

		location = helper.JsonToLineString(linestring)

	}

	if err := s.farmRepo.Create(ctx, farmName, userUUID, location); err != nil {
		return err
	}

	return nil
}

func (s *farmSvc) GetAll(ctx context.Context, userUUID uuid.UUID) ([]model.FarmResponse, error) {
	farm, err := s.farmRepo.GetAll(ctx, userUUID)
	if err != nil {
		return nil, err
	}

	resp := []model.FarmResponse{}
	for _, item := range farm {
		ls := []*model.LineString{}

		if item.FarmLocation != "" {
			ls = *helper.LineToLatLong(item.FarmLocation)
		}

		resp = append(resp, model.FarmResponse{
			FarmUUID:     item.FarmUUID,
			FarmName:     item.FarmName,
			CreatedAt:    item.CreatedAt,
			FarmLocation: ls,
		})
	}

	return resp, nil
}

func (s *farmSvc) DeleteFarmByUUID(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) error {
	userFarm, err := s.usrFarmRepo.FetchUserFarmInfo(ctx, userUUID, farmUUID)
	if err != nil {
		return err
	}

	if userFarm.UserFarmRole != model.USER_FARM_ROLE_OWNER {
		return errors.New("this role has no permission to delete farm")
	}

	return s.farmRepo.Delete(ctx, farmUUID)
}

func (s *farmSvc) UpdateFarmByUUID(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID, farmName string, locationJson string) error {
	location := "NULL"
	if locationJson != "" {
		linestring := []*model.LineStringFloat{}
		if err := helper.JsonToStruct(locationJson, &linestring); err != nil {
			return err
		}

		location = helper.JsonToLineString(linestring)

	}

	userFarm, err := s.usrFarmRepo.FetchUserFarmInfo(ctx, userUUID, farmUUID)
	if err != nil {
		return err
	}

	if userFarm.UserFarmRole != model.USER_FARM_ROLE_OWNER {
		return errors.New("this role has no permission to delete farm")
	}

	return s.farmRepo.Update(ctx, farmUUID, farmName, location)
}
