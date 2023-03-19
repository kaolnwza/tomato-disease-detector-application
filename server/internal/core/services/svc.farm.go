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

func (s *farmSvc) GetAll(ctx context.Context, userUUID uuid.UUID) (*[]*model.FarmResponse, error) {
	farm := []*model.Farm{}
	resp := []*model.FarmResponse{}
	if err := s.farmRepo.GetAll(ctx, &farm, userUUID); err != nil {
		return nil, err
	}

	for _, item := range farm {
		ls := []*model.LineString{}

		if item.FarmLocation.Valid {
			ls = *helper.LineToLatLong(item.FarmLocation.String)
		}

		resp = append(resp, &model.FarmResponse{
			FarmUUID:     item.FarmUUID,
			FarmName:     item.FarmName,
			CreatedAt:    item.CreatedAt,
			FarmLocation: ls,
		})
	}

	return &resp, nil
}

func (s *farmSvc) DeleteFarmByUUID(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) error {
	userFarm := &model.UserFarm{}
	if err := s.usrFarmRepo.FetchUserFarmInfo(ctx, userFarm, userUUID, farmUUID); err != nil {
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

	userFarm := &model.UserFarm{}
	if err := s.usrFarmRepo.FetchUserFarmInfo(ctx, userFarm, userUUID, farmUUID); err != nil {
		return err
	}

	if userFarm.UserFarmRole != model.USER_FARM_ROLE_OWNER {
		return errors.New("this role has no permission to delete farm")
	}

	return s.farmRepo.Update(ctx, farmUUID, farmName, location)
}
