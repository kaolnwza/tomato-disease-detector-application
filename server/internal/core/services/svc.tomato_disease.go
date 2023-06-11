package service

import (
	"context"
	"os"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
	log "tomato-api/lib/logs"

	uuid "github.com/google/uuid"
)

type tomatoDiseaseServices struct {
	tdsRepo port.TomatoDiseaseRepository
	tx      port.Transactor
	storer  port.ImageStorer
	rdb     port.RedisDB
}

func NewTomatoDiseaseServices(r port.TomatoDiseaseRepository, db port.Transactor, storer port.ImageStorer, rdd port.RedisDB) port.TomatoDiseaseService {
	return &tomatoDiseaseServices{
		tdsRepo: r,
		tx:      db,
		storer:  storer,
		rdb:     rdd,
	}
}

func (s *tomatoDiseaseServices) GetTomatoDiseases(ctx context.Context) ([]*model.TomatoDiseaseResponse, error) {
	resp, err := s.rdb.GetTomatoDiseasesCache(ctx)
	if err != nil {
		if s.rdb.IsNil(err) {
			disease, err := s.tdsRepo.GetAll(ctx)
			if err != nil {
				return nil, err
			}

			resp = make([]*model.TomatoDiseaseResponse, len(disease))

			ch := make(chan error, len(disease))

			for idx, i := range disease {
				go func(i model.TomatoDisease, idx int, ctx context.Context) {
					inform := model.NewTomatoDiseaseInform()

					uri, imgErr := s.storer.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), *i.ImagePath)

					images, err := s.GetImagesByDiseaseUUID(context.Background(), i.DiseaseUUID)
					if err != nil {
						log.Error(err)
						return
					}

					informGenerator(&i, inform, images)

					respT := &model.TomatoDiseaseResponse{
						UUID:     i.DiseaseUUID,
						ImageURL: &uri,
						Name:     i.DiseaseName,
						NameThai: i.DiseaseNameThai,
						Inform:   *inform,
					}

					ch <- imgErr

					resp[idx] = respT
				}(i, idx, ctx)

			}

			for i := 0; i < len(disease); i++ {
				err := <-ch
				if err != nil {
					return nil, err
				}
			}

			if err := s.rdb.SetValue(ctx, model.REDIS_TMT_DISEASE, resp); err != nil {
				return nil, err
			}

			return resp, nil
		}

		return nil, err
	}

	return resp, nil
}

func (s *tomatoDiseaseServices) GetTomatoDiseaseByName(ctx context.Context, diseaseName string) (*model.TomatoDiseaseResponse, error) {
	disease, err := s.tdsRepo.GetByName(ctx, diseaseName)
	if err != nil {
		return nil, err
	}

	inform := model.NewTomatoDiseaseInform()
	var uri string
	if disease.ImagePath != nil {
		var err error
		uri, err = s.storer.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), *disease.ImagePath)
		if err != nil {
			return nil, err
		}
	}

	images, err := s.GetImagesByDiseaseUUID(ctx, disease.DiseaseUUID)
	if err != nil {
		return nil, err
	}

	informGenerator(&disease, inform, images)

	resp := &model.TomatoDiseaseResponse{
		UUID:     disease.DiseaseUUID,
		ImageURL: &uri,
		Name:     disease.DiseaseName,
		NameThai: disease.DiseaseNameThai,
		Inform:   *inform,
	}

	return resp, nil
}

// func (inform *tomatoDiseaseInform) informGenerator(disease model.TomatoDisease) {
func informGenerator(disease *model.TomatoDisease, inform *model.TomatoDiseaseInform, images *[]*model.TomatoDiseaseImageResponse) {
	imgMap := make(map[string][]model.TomatoDiseaseInformImage, 0)
	for _, item := range *images {
		imgMap[item.Column] = append(imgMap[item.Column],
			model.TomatoDiseaseInformImage{
				UUID:     item.UUID,
				ImageURI: item.ImageURI,
			})
	}

	info := &model.TomatoDiseaseInformData{}
	symp := info.TypeSymptom(disease.DiseaseSymptom, imgMap["disease_symptom"])
	cause := info.TypeCause(disease.DiseaseCause, imgMap["disease_cause"])
	epidemic := info.TypeEpidemic(disease.DiseaseEpidemic, imgMap["disease_epidemic"])
	resolve := info.TypeResolve(disease.DiseaseResolve, imgMap["disease_resolve"])

	inform.InformData = append(inform.InformData, &symp, &cause, &epidemic, &resolve)
}

func (s *tomatoDiseaseServices) CreateTomatoLog(c context.Context) error {
	if err := s.tdsRepo.Create(c); err != nil {

		return err
	}

	return nil
}

func (s *tomatoDiseaseServices) AddDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, uploadUUIDs string, column string) error {
	img := make([]*model.TomatoDiseaseImage, 0)
	if err := helper.JsonToStruct(uploadUUIDs, &img); err != nil {
		return err
	}

	upload := make([]uuid.UUID, 0)
	for _, item := range img {
		upload = append(upload, item.UploadUUID)
	}

	return s.tx.WithinTransaction(ctx, func(tx context.Context) error {
		if err := s.tdsRepo.AddDiseaseImage(tx, diseaseUUID, upload, column); err != nil {
			return err
		}

		if err := s.rdb.DeleteValue(tx, model.REDIS_TMT_DISEASE_UUID_MAP(diseaseUUID)); err != nil {
			return err
		}

		return s.rdb.DeleteValue(tx, model.REDIS_TMT_DISEASE)
	})
}

func (s *tomatoDiseaseServices) DeleteDiseaseImage(ctx context.Context, diseaseUUID uuid.UUID, imageUUID uuid.UUID) error {
	return s.tx.WithinTransaction(ctx, func(tx context.Context) error {
		if err := s.tdsRepo.DeleteDiseaseImage(tx, diseaseUUID, imageUUID); err != nil {
			return err
		}

		if err := s.rdb.DeleteValue(tx, model.REDIS_TMT_DISEASE_UUID_MAP(diseaseUUID)); err != nil {
			return err
		}

		return s.rdb.DeleteValue(tx, model.REDIS_TMT_DISEASE)
	})
}

func (s *tomatoDiseaseServices) GetImagesByDiseaseUUID(ctx context.Context, diseaseUUID uuid.UUID) (*[]*model.TomatoDiseaseImageResponse, error) {
	resp, err := s.rdb.GetTomatoDiseasesCacheByUUID(ctx, model.REDIS_TMT_DISEASE_UUID_MAP(diseaseUUID))
	if err != nil {
		if s.rdb.IsNil(err) {
			disease, err := s.tdsRepo.GetImagesByDiseaseUUID(ctx, diseaseUUID)
			if err != nil {
				return nil, err
			}

			resp = make([]*model.TomatoDiseaseImageResponse, len(disease))

			ch := make(chan error, len(disease))

			for idx, i := range disease {
				go func(i model.TomatoDiseaseImage, idx int) {
					uri, err := s.storer.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), i.ImagePath)
					ch <- err

					respT := &model.TomatoDiseaseImageResponse{
						UUID:      i.UUID,
						ImageURI:  uri,
						Column:    i.Column,
						CreatedAt: i.CreatedAt,
					}

					resp[idx] = respT
				}(i, idx)

			}

			for i := 0; i < len(disease); i++ {
				if err := <-ch; err != nil {
					return nil, err
				}
			}

			if err := s.rdb.SetValue(ctx, model.REDIS_TMT_DISEASE_UUID_MAP(diseaseUUID), resp); err != nil {
				return nil, err
			}

			return &resp, nil
		}

		return nil, err
	}

	return &resp, nil
}

func (s *tomatoDiseaseServices) UpdateDiseaseInfo(ctx context.Context, diseaseUUID uuid.UUID, column string, text string) error {
	return s.tx.WithinTransaction(ctx, func(tx context.Context) error {
		if err := s.tdsRepo.UpdateDiseaseInfo(tx, diseaseUUID, column, text); err != nil {
			return err
		}

		if err := s.rdb.DeleteValue(tx, model.REDIS_TMT_DISEASE); err != nil {
			return err
		}

		return s.rdb.DeleteValue(tx, model.REDIS_TMT_DISEASE)
	})
}
