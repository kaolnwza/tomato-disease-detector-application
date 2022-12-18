package repo

import (
	"tomato-api/apisrv/model"

	"github.com/jmoiron/sqlx"
)

func CreateUser(tx sqlx.Queryer, user *model.NewUser, provider string) error {
	s := `
	WITH new_user AS (
		INSERT INTO "user" (first_name, last_name)
		SELECT $1, $2
		RETURNING user_uuid
	)

	INSERT INTO user_provider (user_uuid, email, type)
	SELECT (SELECT user_uuid FROM new_user), $3, $4
	RETURNING user_uuid
	`

	return sqlx.Get(tx, &user.UserUUID, s, user.FirstName, user.LastName, user.Email, provider)

}

// func FetchUserByUUID(tx sqlx.Queryer, user *model.User, userUUID uuid.UUID) error {
// 	s := `
// 	SELECT
// 		uuid,
// 		display_name,
// 		email,
// 		birthday,
// 		description,
// 		tel_number,
// 		email,
// 		role,
// 		profile_picture
// 	FROM "user"
// 	WHERE uuid = $1
// 	`

// 	return sqlx.Get(tx, user, s, userUUID)
// }

func FetchExistsUserByEmail(tx sqlx.Queryer, user *model.NewUser, provider string) error {
	s := `
	SELECT user_uuid
	FROM "user"
	WHERE EXISTS (
		SELECT 1 
		FROM user_provider
		WHERE "user".user_uuid = user_provider.user_uuid
		AND type = $2 
		AND email = $1)
	`

	return sqlx.Get(tx, user, s, user.Email, provider)
}
