package service

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	db "tomato-api/internal/adapters/database"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
	log "tomato-api/lib/logs"

	uuid "github.com/google/uuid"
)

type tomatoLogService struct {
	tlRepo    port.TomatoLogRepository
	tx        db.Transactor
	uploadSvc port.UploadService
}

func NewTomatoLogService(r port.TomatoLogRepository, tx db.Transactor, uploadSvc port.UploadService) port.TomatoLogService {
	return &tomatoLogService{
		tlRepo:    r,
		tx:        tx,
		uploadSvc: uploadSvc,
	}
}

func (s *tomatoLogService) GetByFarmUUID(ctx context.Context, farmUUID uuid.UUID) ([]*model.TomatoLogResponse, error) {
	logs := []*model.TomatoLog{}

	if err := s.tlRepo.GetByFarmUUID(ctx, &logs, farmUUID); err != nil {
		log.Error(err)
		return nil, err
	}

	resp := []*model.TomatoLogResponse{}
	errCh := make(chan error)

	for idx, i := range logs {
		resp = append(resp, &model.TomatoLogResponse{
			TomatoLogUUID:   i.TomatoLogUUID,
			RecorderUUID:    i.RecorderUUID,
			DiseaseName:     i.TomatoDiseaseInfo.DiseaseName,
			DiseaseNameThai: i.TomatoDiseaseInfo.DiseaseNameThai,
			Description:     &i.Description.String,
			CreatedAt:       i.CreatedAt,
			UpdatedAt:       i.UpdatedAt,
		})

		go func(i *model.TomatoLog, idx int, respI *model.TomatoLogResponse) {
			uri, err := helper.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), i.UploadPath)
			errCh <- err

			respI.ImageURI = uri

		}(i, idx, resp[idx])
	}

	for i := 0; i < len(logs); i++ {
		err := <-errCh
		if err != nil {
			return nil, err
		}
	}

	return resp, nil
}

func (s *tomatoLogService) GetByUserUUID(ctx context.Context, userUUID uuid.UUID) ([]*model.TomatoLogResponse, error) {
	logs := []*model.TomatoLog{}
	if err := s.tlRepo.GetByUserUUID(ctx, &logs, userUUID); err != nil {
		log.Error(err)
		return nil, err
	}

	errCh := make(chan error)
	resp := []*model.TomatoLogResponse{}

	for idx, i := range logs {
		fmt.Println(i.Location.String)
		lat, long := helper.GeomToLatLong(i.Location.String)

		resp = append(resp, &model.TomatoLogResponse{
			TomatoLogUUID:   i.TomatoLogUUID,
			RecorderUUID:    i.RecorderUUID,
			DiseaseName:     i.TomatoDiseaseInfo.DiseaseName,
			DiseaseNameThai: i.TomatoDiseaseInfo.DiseaseNameThai,
			Description:     &i.Description.String,
			CreatedAt:       i.CreatedAt,
			UpdatedAt:       i.UpdatedAt,
			Latitude:        lat,
			Longtitude:      long,
		})

		go func(i *model.TomatoLog, respI *model.TomatoLogResponse) {
			uri, err := helper.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), i.UploadPath)
			errCh <- err

			respI.ImageURI = uri
		}(i, resp[idx])
	}

	for i := 0; i < len(logs); i++ {
		err := <-errCh
		if err != nil {
			return nil, err
		}
	}

	return resp, nil
}

func (s *tomatoLogService) GetByLogUUID(ctx context.Context, logUUID uuid.UUID) (*model.TomatoLogResponse, error) {
	var logs model.TomatoLog
	if err := s.tlRepo.GetByLogUUID(ctx, &logs, logUUID); err != nil {
		log.Error(err)
		return nil, err
	}

	uri, err := helper.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), logs.UploadPath)
	if err != nil {
		return nil, err
	}

	resp := &model.TomatoLogResponse{
		TomatoLogUUID:   logs.TomatoLogUUID,
		RecorderUUID:    logs.RecorderUUID,
		DiseaseName:     logs.TomatoDiseaseInfo.DiseaseName,
		DiseaseNameThai: logs.TomatoDiseaseInfo.DiseaseNameThai,
		Description:     &logs.Description.String,
		CreatedAt:       logs.CreatedAt,
		UpdatedAt:       logs.UpdatedAt,
		ImageURI:        uri,
	}

	return resp, nil
}

func (s *tomatoLogService) Create(
	ctx context.Context,
	userUUID uuid.UUID,
	farmUUID uuid.UUID,
	description string,
	diseaseName string,
	file multipart.File,
	bucket string,
	lat string,
	long string,
) error {
	// no ACID bcuz need to save uploaded info from gcs to db
	upload, err := s.uploadSvc.Upload(ctx, userUUID, file, bucket)
	if err != nil {
		return err
	}

	var logs model.TomatoLog
	logs.RecorderUUID = userUUID
	logs.Description.String = description
	logs.Description.Valid = description != ""
	logs.UploadUUID = upload.UUID
	geom := helper.LatLongToGeom(lat, long)

	if err := s.tlRepo.Create(ctx, &logs, farmUUID, diseaseName, geom); err != nil {
		return err
	}

	return nil
}
