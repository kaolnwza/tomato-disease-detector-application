package repo

import (
	"tomato-api/apisrv/model"

	"github.com/jmoiron/sqlx"
)

func GetTomatoDisease(tx sqlx.Queryer, disease *[]*model.TomatoDisease) error {
	s := `
		SELECT
			disease_uuid,
			disease_name,
			disease_cause,
			disease_symptom,
			disease_epidemic,
			disease_resolve
		FROM tomato_disease_info`

	return sqlx.Select(tx, disease, s)
}
