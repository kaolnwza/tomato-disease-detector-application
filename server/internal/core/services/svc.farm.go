package service

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"

	uuid "github.com/google/uuid"
)

type farmSvc struct {
	tx       port.Transactor
	farmRepo port.FarmRepository
}

func NewFarmService(tx port.Transactor, farmRepo port.FarmRepository) port.FarmService {
	return &farmSvc{tx: tx, farmRepo: farmRepo}
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
