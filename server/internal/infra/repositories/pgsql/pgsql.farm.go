package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

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
			INSERT INTO farm (farm_name, location)
			SELECT $1, $2
			RETURNING farm_uuid
		),
		farm_plot_create AS (
			INSERT INTO farm_plot(farm_uuid)
			SELECT (SELECT farm_uuid FROM farm_create)
		)

		INSERT INTO user_farm (user_uuid, farm_uuid, user_farm_role)
		SELECT $3, (SELECT farm_uuid FROM farm_create), 'owner'
	`

	return r.tx.Insert(ctx, query, farmName, location, userUUID)
}

func (r *farmRepo) GetAll(ctx context.Context, farm *[]*model.Farm, userUUID uuid.UUID) error {
	query := `
		SELECT
			farm_uuid,
			farm_name,
			farm_location,
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

	return r.tx.Get(ctx, farm, query, userUUID)
}
