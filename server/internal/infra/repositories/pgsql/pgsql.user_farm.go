package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/google/uuid"
)

type usrFarmRepo struct {
	tx port.Transactor
}

func NewUserFarmRepository(tx port.Transactor) port.UserFarmRepository {
	return &usrFarmRepo{tx: tx}
}

func (r *usrFarmRepo) FetchUserFarmInfo(ctx context.Context, user *model.UserFarm, userUUID uuid.UUID, farmUUID uuid.UUID) error {
	query := `
		SELECT 
			user_farm_uuid,
			user_uuid,
			farm_uuid,
			user_farm_role,
			created_at
		FROM user_farm
		WHERE 
			farm_uuid = $1
			AND user_uuid = $2
			AND is_active IS TRUE
	`

	return r.tx.GetOne(ctx, user, query, farmUUID, userUUID)
}

func (r *usrFarmRepo) GetAll(ctx context.Context, users *[]*model.UserFarm, farmUUID uuid.UUID) error {
	query := `
		SELECT
			user_farm_uuid,
			user_uuid,
			user_farm_role,
			created_at
		FROM user_farm
		WHERE farm_uuid = $1
		AND is_active IS TRUE
	`

	return r.tx.Get(ctx, users, query, farmUUID)
}

func (r *usrFarmRepo) AddUserFarm(ctx context.Context, farmUUID uuid.UUID, newUserUUID uuid.UUID) error {
	query := `
		INSERT INTO user_farm (user_uuid, farm_uuid)
		SELECT $1, $2
	`

	return r.tx.Insert(ctx, query, newUserUUID, farmUUID)
}

func (r *usrFarmRepo) UpdateUserFarmRole(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, role model.UserFarmRole) error {
	query := `
		UPDATE user_farm
		SET
			user_farm_role = $1
		WHERE farm_uuid = $2
		AND user_uuid = $3
`

	return r.tx.Update(ctx, query, role, farmUUID, userUUID)
}

func (r *usrFarmRepo) ActivateUserFarm(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, status bool) error {
	query := `
		UPDATE user_farm
		SET
			user_farm_role = $1
		WHERE farm_uuid = $2
		AND user_uuid = $3
`

	return r.tx.Update(ctx, query, status, farmUUID, userUUID)
}
