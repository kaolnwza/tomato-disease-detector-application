package service

import (
	"context"
	model "tomato-api/internal/core/models"
	repo "tomato-api/internal/core/repositories"
	database "tomato-api/lib/database/postgres"
	"tomato-api/lib/pkg"

	"github.com/google/uuid"
)

type userService struct {
	userRepo repo.UserRepository
	tx       database.Transactor
}

func NewUserService(r repo.UserRepository, tx database.Transactor) repo.UserService {
	return &userService{
		userRepo: r,
		tx:       tx,
	}
}

func (s userService) GetUserByProviderID(ctx context.Context, providerType model.ProviderType, providerID string) (*model.User, error) {
	var user *model.User
	if err := s.userRepo.GetUserByProviderID(ctx, user, providerType, providerID); err != nil {
		return nil, err
	}

	return user, nil
}

func (s userService) GoogleLogin(ctx context.Context, providerType model.ProviderType, providerID string) (*string, error) {
	var user *model.User
	if err := s.tx.WithinTransaction(ctx, func(tx context.Context) error {
		if err := s.userRepo.GetUserByProviderID(tx, user, providerType, providerID); err != nil {
			return err
		}

		if user.UserUUID != uuid.Nil {
			return nil
		}

		if err := s.userRepo.Create(tx, user, providerType, providerID); err != nil {
			return err
		}

		return nil

	}); err != nil {
		return nil, err
	}

	accessToken, _, err := pkg.GenerateToken(user.UserUUID)
	if err != nil || accessToken != nil {
		return nil, err
	}

	return accessToken, nil
}
