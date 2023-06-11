package service

import (
	"context"
	"mime/multipart"
	"os"
	"strings"
	"time"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
	log "tomato-api/lib/logs"

	uuid "github.com/google/uuid"
)

type tomatoLogService struct {
	tlRepo     port.TomatoLogRepository
	tx         port.Transactor
	uploadSvc  port.UploadService
	usrFarmSvc port.UserFarmService
	storer     port.ImageStorer
}

func NewTomatoLogService(r port.TomatoLogRepository, tx port.Transactor, uploadSvc port.UploadService, usrFarmSvc port.UserFarmService, storer port.ImageStorer) port.TomatoLogService {
	return &tomatoLogService{
		tlRepo:     r,
		tx:         tx,
		uploadSvc:  uploadSvc,
		usrFarmSvc: usrFarmSvc,
		storer:     storer,
	}
}

func (s *tomatoLogService) GetByFarmUUID(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, startTime *time.Time, endTime *time.Time, diseaseListString string) ([]model.TomatoLogResponse, error) {
	logs := []model.TomatoLog{}
	var err error

	disease := []model.TomatoDiseaseName{
		model.TOMATO_DISEASE_NAME_SPIDER_MITES,
		model.TOMATO_DISEASE_NAME_MOSAIC_VIRUS,
		model.TOMATO_DISEASE_NAME_LEAF_MOLD,
		model.TOMATO_DISEASE_NAME_SEPTORIA_LEAF_SPOT,
		model.TOMATO_DISEASE_NAME_BACTERIAL_SPOT,
		model.TOMATO_DISEASE_NAME_LATE_BLIGHT,
		model.TOMATO_DISEASE_NAME_EARLY_BLIGHT,
		model.TOMATO_DISEASE_NAME_HEALTHY,
		model.TOMATO_DISEASE_NAME_YELLOW_LEAF_CURL_VIRUS,
	}
	diseaseList := strings.Split(diseaseListString, ",")
	if len(diseaseList) > 0 && diseaseListString != "" {
		disease = nil
		for _, item := range diseaseList {
			disease = append(disease, model.TomatoDiseaseNameMap[item])
		}
	}

	if startTime != nil && endTime != nil {
		logs, err = s.tlRepo.GetByFarmUUIDWithTime(ctx, farmUUID, startTime, endTime, disease)
		if err != nil {
			return nil, err
		}

	} else {
		logs, err = s.tlRepo.GetByFarmUUID(ctx, farmUUID, disease)
		if err != nil {
			return nil, err
		}
	}

	if len(logs) < 1 {
		return nil, nil
	}

	resp := []model.TomatoLogResponse{}
	errCh := make(chan error)

	for idx, i := range logs {
		lat, long := helper.PointToLatLong(i.Location)

		resp = append(resp, model.TomatoLogResponse{
			TomatoLogUUID:   i.TomatoLogUUID,
			RecorderUUID:    i.RecorderUUID,
			DiseaseName:     i.TomatoDiseaseInfo.DiseaseName,
			DiseaseNameThai: i.TomatoDiseaseInfo.DiseaseNameThai,
			Description:     &i.Description,
			CreatedAt:       i.CreatedAt,
			UpdatedAt:       i.UpdatedAt,
			Latitude:        lat,
			Longtitude:      long,
			Status:          i.Status,
			Score:           i.Score,
		})

		go func(i model.TomatoLog, idx int, respI model.TomatoLogResponse) {
			uri, err := s.storer.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), i.UploadPath)
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

func (s *tomatoLogService) GetByLogUUID(ctx context.Context, logUUID uuid.UUID) (model.TomatoLogResponse, error) {
	logs, err := s.tlRepo.GetByLogUUID(ctx, logUUID)
	if err != nil {
		log.Error(err)
		return model.TomatoLogResponse{}, err
	}

	uri, err := s.storer.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), logs.UploadPath)
	if err != nil {
		return model.TomatoLogResponse{}, err
	}

	resp := model.TomatoLogResponse{
		TomatoLogUUID:   logs.TomatoLogUUID,
		RecorderUUID:    logs.RecorderUUID,
		DiseaseName:     logs.TomatoDiseaseInfo.DiseaseName,
		DiseaseNameThai: logs.TomatoDiseaseInfo.DiseaseNameThai,
		Description:     &logs.Description,
		CreatedAt:       logs.CreatedAt,
		UpdatedAt:       logs.UpdatedAt,
		ImageURI:        uri,
		Status:          logs.Status,
		Score:           logs.Score,
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
	score float64,
) error {
	// no ACID bcuz need to save uploaded info from gcs to db
	upload, err := s.uploadSvc.Upload(ctx, userUUID, file, bucket)
	if err != nil {
		return err
	}

	var logs model.TomatoLog
	logs.RecorderUUID = userUUID
	logs.Description = description
	logs.UploadUUID = upload.UUID
	geom := helper.LatLongToPoint(lat, long)

	status := helper.TomatoLogStatusVal(diseaseName, false)

	if err := s.tlRepo.Create(ctx, &logs, farmUUID, diseaseName, geom, status, score); err != nil {
		return err
	}

	return nil
}

func (s *tomatoLogService) UpdateByLogUUID(ctx context.Context, logUUID uuid.UUID, desc string, diseaseName string, status string, lat string, long string) error {
	statusType := helper.TomatoLogStatusVal(diseaseName, status == "cured")
	location := helper.LatLongToPoint(lat, long)

	if err := s.tlRepo.Update(ctx, logUUID, desc, diseaseName, location, statusType); err != nil {
		return err
	}

	return nil
}

func (s *tomatoLogService) GetClusterByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startTime string, endTime string, diseaseName string) (model.TomatoSummaryResponse, error) {

	condition := map[string]string{
		"start_time":   startTime,
		"end_time":     endTime,
		"disease_name": diseaseName,
	}

	logs, err := s.tlRepo.GetClusterByFarmUUID(ctx, farmUUID, condition)
	if err != nil {
		return model.TomatoSummaryResponse{}, err
	}

	if len(logs) < 1 {
		return model.TomatoSummaryResponse{}, nil
	}

	centerLat, centerLong := helper.PointToLatLong(logs[0].CenterLocation.String)

	resp := model.TomatoSummaryResponse{}
	resp.Latitude = centerLat
	resp.Longitude = centerLong

	respInfo := []*model.TomatoSummaryInfo{}
	for _, item := range logs {
		lat, long := helper.PointToLatLong(item.Location.String)

		info := model.TomatoSummaryInfo{}
		info.Latitude = lat
		info.Longitude = long
		info.Status = item.Status
		info.CreatedAt = item.CreatedAt
		info.TomatoLogUUID = item.TomatoLogUUID
		info.DiseaseName = item.DiseaseName

		respInfo = append(respInfo, &info)
	}

	resp.Info = respInfo

	return resp, nil
}

func (s *tomatoLogService) GetLogsPercentageByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startTime string, endTime string) ([]model.TomatoLogPercentage, error) {
	condition := map[string]string{
		"start_time": startTime,
		"end_time":   endTime,
	}

	logs, err := s.tlRepo.GetLogsPercentageByFarmUUID(ctx, farmUUID, condition)
	if err != nil {
		return nil, err
	}

	imgErr := make(chan error)
	for _, item := range logs {
		go func(item model.TomatoLogPercentage) {
			url, err := s.storer.GenerateImageURI(ctx, os.Getenv("GCS_BUCKET_1"), item.Path)
			imgErr <- err

			item.ImageUrl = url
		}(item)
	}

	for i := 0; i < len(logs); i++ {
		if err := <-imgErr; err != nil {
			return nil, err
		}
	}

	return logs, nil

}

func (s *tomatoLogService) GetLogsPercentageDailyByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startDate string, endDate string) ([]model.TomatoLogPercentageDailyResponse, error) {
	logs, err := s.tlRepo.GetLogsPercentageDailyByFarmUUID(ctx, farmUUID, startDate, endDate)
	if err != nil {
		return nil, err
	}

	resp := make([]model.TomatoLogPercentageDailyResponse, 0)
	if err := helper.StructCopy(logs, &resp); err != nil {
		return nil, err
	}

	return resp, nil

}

func (s *tomatoLogService) UpdateLogStatusByLogUUID(ctx context.Context, logUUID uuid.UUID, status model.TomatoLogStatus) error {
	return s.tlRepo.UpdateLogStatusByLogUUID(ctx, logUUID, status)
}