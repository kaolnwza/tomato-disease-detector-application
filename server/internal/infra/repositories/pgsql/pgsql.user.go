package pgsql

import (
	"context"
	"database/sql"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"

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

func (r *userRepo) Create(tx context.Context, user model.User, provider model.ProviderType, providerID string) error {
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

func (r *userRepo) GetUserByProviderID(ctx context.Context, providerType model.ProviderType, providerID string) (model.User, error) {
	userDB := model.UserDB{}
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

	user := model.User{}
	if err := r.tx.GetOne(ctx, &userDB, query, providerType, providerID); err != nil {
		if err == sql.ErrNoRows {
			return model.User{}, nil
		}

		return model.User{}, err
	}

	if err := helper.StructCopy(userDB, &user); err != nil {
		return model.User{}, err
	}

	return user, nil
}

func (r *userRepo) GetUserByUUID(ctx context.Context, userUUID uuid.UUID) (model.User, error) {
	userDB := model.UserDB{}
	query := `
		SELECT
			user_uuid,
			first_name,
			COALESCE(last_name, '') last_name,
			member_id
		FROM "user"
		WHERE user_uuid = $1
	`

	if err := r.tx.GetOne(ctx, &userDB, query, userUUID); err != nil {
		if err == sql.ErrNoRows {
			return model.User{}, nil
		}

		return model.User{}, err
	}

	user := model.User{}
	if err := helper.StructCopy(userDB, &user); err != nil {
		return model.User{}, err
	}

	return user, nil
}

func (r *userRepo) GetUserByMemberID(ctx context.Context, memberID string) (model.User, error) {
	userDB := model.UserDB{}
	query := `
		SELECT
			user_uuid,
			first_name,
			COALESCE(last_name, '') last_name,
			member_id
		FROM "user"
		WHERE member_id = $1
	`

	user := model.User{}
	if err := r.tx.GetOne(ctx, &userDB, query, memberID); err != nil {
		if err == sql.ErrNoRows {
			return model.User{}, nil
		}
		return model.User{}, err
	}

	if err := helper.StructCopy(userDB, &user); err != nil {
		return model.User{}, err
	}

	return user, nil
}
