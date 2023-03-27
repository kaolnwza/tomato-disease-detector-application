package service

import (
	"context"
	"os"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"

	"tomato-api/lib/helper"
)

type tomatoDiseaseServices struct {
	tdsRepo port.TomatoDiseaseRepository
	tx      port.Transactor
}

func NewTomatoDiseaseServices(r port.TomatoDiseaseRepository, db port.Transactor) port.TomatoDiseaseService {
	return &tomatoDiseaseServices{
		tdsRepo: r,
		tx:      db,
	}
}

func (s *tomatoDiseaseServices) GetTomatoDiseases(ctx context.Context) ([]*model.TomatoDiseaseResponse, error) {
	disease := []*model.TomatoDisease{}
	if err := s.tdsRepo.GetAll(ctx, &disease); err != nil {
		return nil, err
	}

	resp := make([]*model.TomatoDiseaseResponse, len(disease))
	ch := make(chan error, len(disease))

	for idx, i := range disease {
		go func(i *model.TomatoDisease, idx int) {
			inform := model.NewTomatoDiseaseInform()

			uri, err := helper.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), i.ImagePath)
			ch <- err

			informGenerator(i, inform)

			respT := &model.TomatoDiseaseResponse{
				UUID:     i.DiseaseUUID,
				ImageURL: uri,
				Name:     i.DiseaseName,
				NameThai: i.DiseaseNameThai,
				Inform:   *inform,
			}

			resp[idx] = respT
		}(i, idx)

	}

	for i := 0; i < len(disease); i++ {
		err := <-ch
		if err != nil {
			return nil, err
		}
	}

	return resp, nil
}

func (s *tomatoDiseaseServices) GetTomatoDiseaseByName(ctx context.Context, diseaseName string) (*model.TomatoDiseaseResponse, error) {
	disease := &model.TomatoDisease{}
	if err := s.tdsRepo.GetByName(ctx, diseaseName, disease); err != nil {
		return nil, err
	}

	inform := model.NewTomatoDiseaseInform()

	uri, err := helper.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), disease.ImagePath)
	if err != nil {
		return nil, err
	}

	informGenerator(disease, inform)

	resp := &model.TomatoDiseaseResponse{
		UUID:     disease.DiseaseUUID,
		ImageURL: uri,
		Name:     disease.DiseaseName,
		NameThai: disease.DiseaseNameThai,
		Inform:   *inform,
	}

	return resp, nil
}

// func (inform *tomatoDiseaseInform) informGenerator(disease model.TomatoDisease) {
func informGenerator(disease *model.TomatoDisease, inform *model.TomatoDiseaseInform) {
	info := &model.TomatoDiseaseInformData{}
	symp := info.TypeSymptom(disease.DiseaseSymptom)
	cause := info.TypeCause(disease.DiseaseCause)
	epidemic := info.TypeEpidemic(disease.DiseaseEpidemic)
	resolve := info.TypeResolve(disease.DiseaseResolve)

	inform.InformData = append(inform.InformData, &symp, &cause, &epidemic, &resolve)
}

func (s *tomatoDiseaseServices) CreateTomatoLog(c context.Context) error {
	// c.Value()
	// userUUID, ok := c.Request.Value("access_user_uuid").(uuid.UUID)
	// if !ok {
	// 	c.Status(http.StatusInternalServerError)
	// 	c.Abort()
	// 	return
	// }

	// desc := c.Request.FormValue("description")
	// disease := c.Request.FormValue("disease")

	// tx, err := port.DB.Beginx()
	// if err != nil {
	// 	c.JSON(http.StatusInternalServerError, err.Error())
	// 	return
	// }
	// upload, err := FileUploadToBucketByImage(c, userUUID, tx)
	// if err != nil {
	// 	tx.Rollback()
	// 	c.JSON(http.StatusInternalServerError, err.Error())
	// 	return
	// }

	if err := s.tdsRepo.Create(c); err != nil {
		// tx.Rollback()
		// c.JSON(http.StatusInternalServerError, err.Error())
		return err
	}

	return nil
	// if err := tx.Commit(); err != nil {
	// 	tx.Rollback()
	// 	c.JSON(500, err.Error())
	// 	return
	// }

	// c.JSON(200, nil)

}
