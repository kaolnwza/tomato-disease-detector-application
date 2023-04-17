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

func (r *usrFarmRepo) GetAll(ctx context.Context, users *[]*model.UserFarm, farmUUID uuid.UUID, limit int, offset int) error {
	query := `
		SELECT
			user_farm_uuid,
			user_farm.user_uuid,
			u.first_name AS "user.first_name",
			u.last_name AS "user.last_name",
			u.member_id AS "user.member_id",
			user_farm_role,
			user_farm.created_at
		FROM user_farm
		LEFT JOIN "user" u ON u.user_uuid = user_farm.user_uuid
		WHERE farm_uuid = $1
		AND user_farm.is_active IS TRUE
		ORDER BY user_farm.created_at
		OFFSET $2
		LIMIT $3
	`

	return r.tx.Get(ctx, users, query, farmUUID, offset, limit)
}

func (r *usrFarmRepo) AddUserFarm(ctx context.Context, farmUUID uuid.UUID, newUserUUID uuid.UUID, role model.UserFarmRole) error {
	query := `
		INSERT INTO user_farm (user_uuid, farm_uuid, user_farm_role)
		SELECT $1, $2, $3
	`

	return r.tx.Insert(ctx, query, newUserUUID, farmUUID, role)
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
			is_active = $1
		WHERE farm_uuid = $2
		AND user_uuid = $3
`

	return r.tx.Update(ctx, query, status, farmUUID, userUUID)
}
