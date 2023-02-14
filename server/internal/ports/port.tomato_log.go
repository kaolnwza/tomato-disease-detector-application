package port

import (
	"context"
	"mime/multipart"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type TomatoLogRepository interface {
	GetByFarmUUID(ctx context.Context, dest *[]*model.TomatoLog, farmUUID uuid.UUID) error
	GetByLogUUID(ctx context.Context, dest *model.TomatoLog, logUUID uuid.UUID) error
	GetByUserUUID(ctx context.Context, dest *[]*model.TomatoLog, userUUID uuid.UUID) error
	Create(ctx context.Context, logs *model.TomatoLog, farmUUID uuid.UUID, diseaseName string, location string, status model.TomatoLogStatus) error
	Update(ctx context.Context, logUUID uuid.UUID, desc string, diseaseName string, location string, status model.TomatoLogStatus) error
	GetClusterByFarmUUID(ctx context.Context, logs *[]*model.TomatoSummary, farmUUID uuid.UUID, condition map[string]string) error
}

type TomatoLogService interface {
	GetByFarmUUID(ctx context.Context, farmUUID uuid.UUID) ([]*model.TomatoLogResponse, error)
	GetByUserUUID(ctx context.Context, userUUID uuid.UUID) ([]*model.TomatoLogResponse, error)
	GetByLogUUID(ctx context.Context, logUUID uuid.UUID) (*model.TomatoLogResponse, error)
	Create(ctx context.Context, userUUID uuid.UUID, farmUUID uuid.UUID, desc string, diseaseName string, file multipart.File, bucket string, lat string, long string) error
	UpdateByLogUUID(ctx context.Context, logUUID uuid.UUID, desc string, diseaseName string, status string, lat string, long string) error
	GetClusterByFarmUUID(ctx context.Context, farmUUID uuid.UUID, startTime string, endTime string, diseaseName string) (*model.TomatoSummaryResponse, error)
}
