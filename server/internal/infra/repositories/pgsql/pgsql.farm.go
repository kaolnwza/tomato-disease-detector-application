package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"

	"github.com/google/uuid"
)

type farmRepo struct {
	tx port.Transactor
}

func NewFarmRepository(tx port.Transactor) port.FarmRepository {
	return &farmRepo{tx: tx}
}

func (r *farmRepo) Create(ctx context.Context, farmName string, userUUID uuid.UUID, location string) error {
	query := `
		WITH farm_create AS (
			INSERT INTO farm (farm_name, farm_location)
			SELECT $1, ` + location + `
			RETURNING farm_uuid
		),
		farm_plot_create AS (
			INSERT INTO farm_plot(farm_uuid)
			SELECT (SELECT farm_uuid FROM farm_create)
		)

		INSERT INTO user_farm (user_uuid, farm_uuid, user_farm_role)
		SELECT $2, (SELECT farm_uuid FROM farm_create), 'owner'
	`

	return r.tx.Insert(ctx, query, farmName, userUUID)
}

func (r *farmRepo) GetAll(ctx context.Context, userUUID uuid.UUID) ([]model.Farm, error) {
	query := `
		SELECT
			farm_uuid,
			farm_name,
			ST_AsGeoJSON("farm_location")::json->>'coordinates' AS "farm_location",
			is_active,
			created_at
		FROM farm
		WHERE EXISTS (
			SELECT 1
			FROM user_farm
			WHERE user_uuid = $1
			AND user_farm.farm_uuid = farm.farm_uuid
			AND is_active IS TRUE
		)
		AND is_active IS TRUE
	`

	farmDB := make([]model.FarmDB, 0)
	if err := r.tx.Get(ctx, &farmDB, query, userUUID); err != nil {
		return nil, err
	}

	farm := make([]model.Farm, 0)
	if err := helper.StructCopy(farmDB, &farm); err != nil {
		return nil, err
	}

	return farm, nil
}

func (r *farmRepo) GetByUUID(ctx context.Context, farmUUID uuid.UUID) (model.Farm, error) {
	query := `
		SELECT
			farm_uuid,
			farm_name,
			ST_AsGeoJSON("farm_location")::json->>'coordinates' AS "farm_location",
			is_active,
			created_at
		FROM farm
		WHERE is_active IS TRUE
		AND farm_uuid = $1
	`

	farmDB := model.FarmDB{}
	if err := r.tx.GetOne(ctx, &farmDB, query, farmUUID); err != nil {
		return model.Farm{}, err
	}

	farm := model.Farm{}
	if err := helper.StructCopy(farmDB, &farm); err != nil {
		return model.Farm{}, err
	}

	return farm, nil
}

func (r *farmRepo) Delete(ctx context.Context, farmUUID uuid.UUID) error {
	query := `
		UPDATE farm
		SET is_active = false
		WHERE farm_uuid = $1
	`

	return r.tx.Delete(ctx, query, farmUUID)
}

func (r *farmRepo) Update(ctx context.Context, farmUUID uuid.UUID, farmName string, location string) error {
	query := `
		UPDATE farm
		SET 
			farm_name = $1,
			farm_location = ` + location + `
		WHERE farm_uuid = $2
	`

	return r.tx.Update(ctx, query, farmName, farmUUID)
}
