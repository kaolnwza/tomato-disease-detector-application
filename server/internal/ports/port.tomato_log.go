package port

import (
	"context"
	"mime/multipart"
	"time"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type TomatoLogRepository interface {
	GetByFarmUUID(ctx context.Context, farmUUID uuid.UUID, diseaseList []model.TomatoDiseaseName) ([]model.TomatoLog, error)
	GetByFarmUUIDWithTime(ctx context.Context, farmUUID uuid.UUID, startTime *time.Time, endTime *time.Time, diseaseList []model.TomatoDiseaseName) ([]model.TomatoLog, error)
	GetByLogUUID(ctx context.Context, logUUID uuid.UUID) (model.TomatoLog, error)
	GetByUserUUID(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) ([]model.TomatoLog, error)
	Create(ctx context.Context, log *model.TomatoLog, farmUUID uuid.UUID, diseaseName string, location string, status model.TomatoLogStatus, score float64) error
	Update(ctx context.Context, logUUID uuid.UUID, desc string, diseaseName string, location string, status model.TomatoLogStatus) error
	GetClusterByFarmUUID(ctx context.Context, farmUUID uuid.UUID, condition map[string]string) ([]model.TomatoSummary, error)
	GetLogsPercentageByFarmUUID(ctx context.Context, farmUUID uuid.UUID, condition map[string]string) ([]model.TomatoLogPercentage, error)
	GetLogsPercentageDailyByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startDate string, endDate string) ([]model.TomatoLogPercentage, error)
	UpdateLogStatusByLogUUID(ctx context.Context, logUUID uuid.UUID, status model.TomatoLogStatus) error
}

type TomatoLogService interface {
	GetByFarmUUID(ctx context.Context, farmUUID uuid.UUID, userUUID uuid.UUID, startTime *time.Time, endTime *time.Time, diseaseList string) ([]model.TomatoLogResponse, error)
	// GetByUserUUID(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID) ([]*model.TomatoLogResponse, error)
	GetByLogUUID(ctx context.Context, logUUID uuid.UUID) (model.TomatoLogResponse, error)
	Create(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID, desc string, diseaseName string, file multipart.File, bucket string, lat string, long string, score float64) error
	UpdateByLogUUID(ctx context.Context, logUUID uuid.UUID, desc string, diseaseName string, status string, lat string, long string) error
	GetClusterByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startTime string, endTime string, diseaseName string) (model.TomatoSummaryResponse, error)
	GetLogsPercentageByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startTime string, endTime string) ([]model.TomatoLogPercentage, error)
	GetLogsPercentageDailyByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startTime string, endTime string) ([]model.TomatoLogPercentageDailyResponse, error)
	UpdateLogStatusByLogUUID(ctx context.Context, logUUID uuid.UUID, status model.TomatoLogStatus) error
}
