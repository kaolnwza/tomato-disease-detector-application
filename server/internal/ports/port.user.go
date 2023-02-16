package port

import (
	"context"
	model "tomato-api/internal/core/models"
)

type UserRepository interface {
	Create(ctx context.Context, dest *model.User, providerType model.ProviderType, providerID string) error
	GetUserByProviderID(ctx context.Context, dest *model.User, providerType model.ProviderType, providerID string) error
}

type UserService interface {
	GetUserByProviderID(context.Context, model.ProviderType, string) (*model.User, error)
	GoogleLogin(context.Context, model.ProviderType, string, string, string) (*string, error)
	// RegisterUser(uuid.UUID)
}

// type TomatoDiseaseService interface {
// 	GetTomatoDiseases(context.Context) ([]*model.TomatoDiseaseResponse, error)
// }
