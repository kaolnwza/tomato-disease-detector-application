package pgsql

import (
	"context"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"github.com/google/uuid"
)

type userRepo struct {
	tx port.Transactor
}

// func NewTomatoDiseaseRepo(db *sqlx.DB) port.TomatoDiseaseRepository {
// 	return &tomatoDiseaseRepo{db: db}
// }

func NewUserRepo(tx port.Transactor) port.UserRepository {
	return &userRepo{tx: tx}
}

func (r *userRepo) Create(tx context.Context, user *model.User, provider model.ProviderType, providerID string) error {
	query := `
	WITH new_user AS (
		INSERT INTO "user" (first_name, last_name, member_id)
		SELECT $1, $2, (
			SELECT array_to_string(array(
				SELECT substr('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', trunc(random() * 25)::integer + 1, 1)
				FROM  generate_series(1, 6)), ''
				)
		)
		RETURNING user_uuid
	)

	INSERT INTO user_provider (user_uuid, email, type, provider_id)
	SELECT (SELECT user_uuid FROM new_user), $3, $4, $5
	RETURNING user_uuid
	`

	return r.tx.InsertWithReturningOne(tx, user, query, user.FirstName, user.LastName, user.Email, provider, providerID)
}

func (r *userRepo) GetUserByProviderID(ctx context.Context, user *model.User, providerType model.ProviderType, providerID string) error {
	query := `
	SELECT
		user_uuid,
		first_name,
		last_name,
		member_id
	FROM "user"
	WHERE user_uuid = (
		SELECT user_uuid
		FROM user_provider
		WHERE provider_id = $2
		AND type = $1
	)
	`

	return r.tx.GetOne(ctx, user, query, providerType, providerID)
}

func (r *userRepo) GetUserByUUID(ctx context.Context, user *model.User, userUUID uuid.UUID) error {
	query := `
		SELECT
			user_uuid,
			first_name,
			COALESCE(last_name, '') last_name,
			member_id
		FROM "user"
		WHERE user_uuid = $1
	`

	return r.tx.GetOne(ctx, user, query, userUUID)
}

func (r *userRepo) GetUserByMemberID(ctx context.Context, user *model.User, memberID string) error {
	query := `
		SELECT
			user_uuid,
			first_name,
			COALESCE(last_name, '') last_name,
			member_id
		FROM "user"
		WHERE member_id = $1
	`

	return r.tx.GetOne(ctx, user, query, memberID)
}
