package port

import (
	"context"
	model "tomato-api/internal/core/models"

	"github.com/google/uuid"
)

type UserRepository interface {
	Create(ctx context.Context, dest model.User, providerType model.ProviderType, providerID string) error
	GetUserByProviderID(ctx context.Context, providerType model.ProviderType, providerID string) (model.User, error)
	GetUserByUUID(ctx context.Context, userUUID uuid.UUID) (model.User, error)
	GetUserByMemberID(ctx context.Context, memberID string) (model.User, error)
}

type UserService interface {
	GetUserByProviderID(context.Context, model.ProviderType, string) (model.UserResponse, error)
	GoogleLogin(context.Context, model.ProviderType, string, string, string) (*string, *string, error)
	DeviceLogin(ctx context.Context, providerType model.ProviderType, provideId string, fullname string) (*string, *string, error)
	GetUserByUUID(ctx context.Context, userUUID uuid.UUID) (model.UserResponse, error)
	GetUserByMemberID(ctx context.Context, memberID string) (model.UserResponse, error)
	// RegisterUser(uuid.UUID)
}

// type TomatoDiseaseService interface {
// 	GetTomatoDiseases(context.Context) ([]*model.TomatoDiseaseResponse, error)
// }
