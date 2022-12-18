package repo

import (
	"tomato-api/apisrv/model"

	"github.com/jmoiron/sqlx"
)

// type userFarmI struct {
// 	model.UserFarmInterface
// }

// type UserFarmInterface interface {
// 	GetAllUsersFarm() (*[]*model.UserFarm, error)
// }

// func NewCustomerRepositoryDB() userFarmI {
// 	return customerRepositoryDB{db: db}
// }

func GetAllUsersFarm(tx sqlx.Queryer, userFarm *[]*model.UserFarm) error {
	s := `
		SELECT * FROM user_farm`

	return sqlx.Select(tx, &userFarm, s)
}
