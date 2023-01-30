package pgsql

import (
	"context"
	db "tomato-api/internal/adapters/database"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
)

type userRepo struct {
	tx db.Transactor
}

// func NewTomatoDiseaseRepo(db *sqlx.DB) port.TomatoDiseaseRepository {
// 	return &tomatoDiseaseRepo{db: db}
// }

func NewUserRepo(tx db.Transactor) port.UserRepository {
	return &userRepo{tx: tx}
}

func (r *userRepo) Create(tx context.Context, user *model.User, provider model.ProviderType, providerID string) error {
	query := `
	WITH new_user AS (
		INSERT INTO "user" (first_name, last_name)
		SELECT $1, $2
		RETURNING user_uuid
	)

	INSERT INTO user_provider (user_uuid, email, type, provider_id)
	SELECT (SELECT user_uuid FROM new_user), $3, $4, $5
	RETURNING user_uuid
	`

	return r.tx.InsertWithReturning(tx, &user, query, user.FirstName, user.LastName, user.Email, provider, providerID)
}

func (r *userRepo) GetUserByProviderID(ctx context.Context, user *model.User, providerType model.ProviderType, providerID string) error {
	query := `
	SELECT
		user_uuid,
		first_name,
		last_name,
		email
	FROM users
	WHERE user_uuid = (
		SELECT user_uuid
		FROM user_provider
		WHERE provider_id = $2
		AND type = $1
	)
	`

	return r.tx.GetOne(ctx, &user, query, providerType, providerID)
}
