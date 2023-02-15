package service

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	uuid "github.com/google/uuid"
)

type farmSvc struct {
	tx       port.Transactor
	farmRepo port.FarmRepository
}

func NewFarmService(tx port.Transactor, farmRepo port.FarmRepository) port.FarmService {
	return &farmSvc{tx: tx, farmRepo: farmRepo}
}

func (s *farmSvc) Create(ctx context.Context, farmName string, userUUID uuid.UUID, linestring string) error {
	// location :=helper.LatLongToPoint(latitude, longtitude)
	location := "NULL"
	if linestring != "" {
		location = "'" + linestring + "'"
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
		resp = append(resp, &model.FarmResponse{
			FarmUUID:     item.FarmUUID,
			FarmName:     item.FarmName,
			FarmLocation: item.FarmLocation.String,
			CreatedAt:    item.CreatedAt,
		})
	}

	return &resp, nil
}
