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
			disease_resolve,
			path as image_path
		FROM tomato_disease_info
		LEFT JOIN upload ON upload.upload_uuid = tomato_disease_info.upload_uuid`

	return sqlx.Select(tx, disease, s)
}
