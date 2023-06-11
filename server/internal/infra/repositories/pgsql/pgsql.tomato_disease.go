package pgsql

import (
	"context"
	"fmt"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"

	"github.com/google/uuid"
)

type tomatoDiseaseRepo struct {
	tx port.Transactor
}

func NewTomatoDiseaseRepo(tx port.Transactor) port.TomatoDiseaseRepository {
	return &tomatoDiseaseRepo{
		tx: tx,
	}
}

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

func (r *tomatoDiseaseRepo) GetAll(ctx context.Context) ([]model.TomatoDisease, error) {
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
		WHERE disease_name != 'Healthy'`

	diseaseDB := make([]model.TomatoDiseaseDB, 0)
	if err := r.tx.Get(ctx, &diseaseDB, query); err != nil {
		return nil, err
	}

	disease := make([]model.TomatoDisease, 0)
	if err := helper.StructCopy(diseaseDB, &disease); err != nil {
		return nil, err
	}

	return disease, nil
}

func (r *tomatoDiseaseRepo) GetByName(ctx context.Context, diseaseName string) (model.TomatoDisease, error) {
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

	diseaseDB := model.TomatoDiseaseDB{}
	if err := r.tx.GetOne(ctx, &diseaseDB, query, diseaseName); err != nil {
		return model.TomatoDisease{}, err
	}

	disease := model.TomatoDisease{}
	if err := helper.StructCopy(diseaseDB, &disease); err != nil {
		return model.TomatoDisease{}, err
	}

	return disease, nil
}

func (r *tomatoDiseaseRepo) AddDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, uploadUUID []uuid.UUID, column string) error {
	values := ``
	for idx, item := range uploadUUID {
		values += fmt.Sprintf(`('%s', '%s', '%s')`, diseaseUUID, item, column)
		if idx != len(uploadUUID)-1 {
			values += ","
		}
	}

	query := `
		INSERT INTO tomato_disease_image (disease_uuid, upload_uuid, "column")
		VALUES ` + values

	return r.tx.Insert(ctx, query)
}

func (r *tomatoDiseaseRepo) DeleteDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, imageUUID uuid.UUID) error {
	query := `
		DELETE FROM tomato_disease_image
		WHERE uuid = $1
		AND disease_uuid = $2
	`

	return r.tx.Delete(ctx, query, diseaseUUID, imageUUID)
}

func (r *tomatoDiseaseRepo) GetImagesByDiseaseUUID(ctx context.Context, diseaseUUID uuid.UUID) ([]model.TomatoDiseaseImage, error) {
	query := `
		SELECT
			uuid,
			disease_uuid,
			tomato_disease_image.upload_uuid,
			path AS image_path,
			tomato_disease_image.created_at,
			"column"
		FROM tomato_disease_image
		LEFT JOIN upload ON tomato_disease_image.upload_uuid = upload.upload_uuid
		WHERE disease_uuid = $1
		ORDER BY created_at DESC
	`

	diseaseDB := make([]model.TomatoDiseaseImageDB, 0)
	if err := r.tx.Get(ctx, &diseaseDB, query, diseaseUUID); err != nil {
		return nil, err
	}

	disease := make([]model.TomatoDiseaseImage, 0)
	if err := helper.StructCopy(diseaseDB, &disease); err != nil {
		return nil, err
	}

	return disease, nil
}

func (r *tomatoDiseaseRepo) UpdateDiseaseInfo(ctx context.Context, diseaseUUID uuid.UUID, column string, text string) error {
	query := fmt.Sprintf(`
		UPDATE tomato_disease_info
		SET %s = $1
		WHERE disease_uuid = $2
	`, column)

	return r.tx.Update(ctx, query, text, diseaseUUID)
}
