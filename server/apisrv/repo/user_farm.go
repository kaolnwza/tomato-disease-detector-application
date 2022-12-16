package repo

import "tomato-api/apisrv/model"

// type userFarmI struct {
// 	model.UserFarmInterface
// }

// type UserFarmInterface interface {
// 	GetAllUsersFarm() (*[]*model.UserFarm, error)
// }

// func NewCustomerRepositoryDB() userFarmI {
// 	return customerRepositoryDB{db: db}
// }

func GetAllUsersFarm(userFarm *[]*model.UserFarm) error {
	s := `
		SELECT * FROM user_farm`

	return db.Select(&userFarm, s)
}
