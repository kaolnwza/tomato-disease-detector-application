package repo

import "tomato-api/apisrv/model"

func GetTomatoDisease(disease *[]*model.TomatoDisease) error {
	s := `
		SELECT
			disease_uuid,
			disease_name,
			disease_cause,
			disease_symptom,
			disease_epidemic,
			disease_resolve
		FROM tomato_disease_info`

	return db.Select(disease, s)
}
