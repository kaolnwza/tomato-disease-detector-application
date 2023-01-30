package pgsql

import (
	"context"
	db "tomato-api/internal/adapters/database"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
)

type tomatoDiseaseRepo struct {
	tx db.Transactor
}

// func NewTomatoDiseaseRepo(db db.Transactor) port.TomatoDiseaseRepository {
// 	return &tomatoDiseaseRepo{db: db}
// }

func NewTomatoDiseaseRepo(tx db.Transactor) port.TomatoDiseaseRepository {
	return &tomatoDiseaseRepo{
		tx: tx,
	}
}

// func (r *tomatoDiseaseRepo) GetAll(ctx context.Context) ([]model.TomatoDisease, error) {
// 	query := `
// 		SELECT
// 			disease_uuid,
// 			disease_name,
// 			disease_name_th,
// 			disease_cause,
// 			disease_symptom,
// 			disease_epidemic,
// 			disease_resolve,
// 			path as image_path
// 		FROM tomato_disease_info
// 		LEFT JOIN upload ON upload.upload_uuid = tomato_disease_info.upload_uuid
// 		`

// 	disease := []model.TomatoDisease{}
// 	// ex. test clean transaction
// 	if err := r.db.WithinTransaction(ctx, func(tx context.Context) error {
// 		return r.db.Select(tx, &disease, query)
// 	}); err != nil {
// 		return nil, err
// 	}

// 	fmt.Println("pass")
// 	return disease, nil
// }

func (r *tomatoDiseaseRepo) Create(ctx context.Context) error {
	// s := `
	// 	INSERT INTO tomato_log (farm_plot_uuid, recorder_uuid, tomato_disease_uuid, description, upload_uuid)
	// 	SELECT
	// 		$1,
	// 		$2,
	// 		(SELECT disease_uuid FROM tomato_disease_info WHERE disease_name = $3),
	// 		$4,
	// 		$5
	// `
	// s = `
	// INSERT INTO tomato_log ( description)
	// 	SELECT
	// 	$1
	// `

	// _, err := sqlx.Exec(ctx, s, "kuy")
	return nil

}

func (r *tomatoDiseaseRepo) GetAll(ctx context.Context, disease *[]*model.TomatoDisease) error {
	query := `
		SELECT
			disease_uuid,
			disease_name,
			disease_name_th,
			disease_cause,
			disease_symptom,
			disease_epidemic,
			disease_resolve,
			path as image_path
		FROM tomato_disease_info
		LEFT JOIN upload ON upload.upload_uuid = tomato_disease_info.upload_uuid`

	return r.tx.Get(ctx, disease, query)
}

func (r *tomatoDiseaseRepo) GetByName(ctx context.Context, diseaseName string, disease *model.TomatoDisease) error {
	query := `
		SELECT
			disease_uuid,
			disease_name,
			disease_name_th,
			disease_cause,
			disease_symptom,
			disease_epidemic,
			disease_resolve,
			path as image_path
		FROM tomato_disease_info
		LEFT JOIN upload ON upload.upload_uuid = tomato_disease_info.upload_uuid
		WHERE disease_name = $1`

	return r.tx.GetOne(ctx, disease, query, diseaseName)
}
