package service

import (
	"context"
	"database/sql"
	"strings"
	model "tomato-api/internal/core/models"
	port "tomato-api/internal/ports"
	"tomato-api/lib/helper"
	"tomato-api/lib/pkg"

	"github.com/google/uuid"
)

type userService struct {
	userRepo port.UserRepository
	tx       port.Transactor
}

func NewUserService(r port.UserRepository, tx port.Transactor) port.UserService {
	return &userService{
		userRepo: r,
		tx:       tx,
	}
}

func (s userService) GetUserByProviderID(ctx context.Context, providerType model.ProviderType, providerID string) (*model.UserResponse, error) {
	user := model.User{}
	if err := s.userRepo.GetUserByProviderID(ctx, &user, providerType, providerID); err != nil {
		return nil, err
	}

	resp := model.UserResponse{}
	if err := helper.StructCopy(user, &resp); err != nil {
		return nil, err
	}

	return &resp, nil
}

func (s userService) GoogleLogin(ctx context.Context, providerType model.ProviderType, providerID string, email string, name string) (*string, *string, error) {
	user := model.User{}
	if err := s.tx.WithinTransaction(ctx, func(tx context.Context) error {
		if err := s.userRepo.GetUserByProviderID(tx, &user, providerType, providerID); err != nil && err != sql.ErrNoRows {
			return err
		}

		if user.UserUUID == uuid.Nil {
			user.Email.String = email
			user.Email.Valid = email != ""
			if name != "" {
				name := strings.Split(name, " ")
				user.FirstName = name[0]
				user.LastName = name[1]
			}

			if err := s.userRepo.Create(tx, &user, providerType, providerID); err != nil {
				return err
			}
		}

		return nil

	}); err != nil {
		return nil, nil, err
	}

	accessToken, _, err := pkg.GenerateToken(user.UserUUID)
	if err != nil || accessToken == nil {
		return nil, nil, err
	}

	role := "owner"

	return accessToken, &role, nil
}

func (s userService) DeviceLogin(ctx context.Context, providerType model.ProviderType, deviceId string, fullname string) (*string, *string, error) {

	user := model.User{}
	if err := s.userRepo.GetUserByProviderID(ctx, &user, model.PROVIDER_TYPE_DEVICE_ID, deviceId); err != nil {
		if err != sql.ErrNoRows {
			return nil, nil, err
		}

		nameSplit := []string{"", ""}
		if fullname != "" {
			temp := strings.Split(fullname, " ")
			if len(temp) == 2 {
				nameSplit = temp
			} else if len(temp) == 1 {
				nameSplit[0] = temp[0]
			}
		}
		user = model.User{
			Email:     sql.NullString{"", false},
			FirstName: nameSplit[0],
			LastName:  nameSplit[1],
		}

		if err := s.userRepo.Create(ctx, &user, providerType, deviceId); err != nil {
			return nil, nil, err
		}
	}

	accessToken, _, err := pkg.GenerateToken(user.UserUUID)
	if err != nil || accessToken == nil {
		return nil, nil, err
	}

	role := "employee"

	return accessToken, &role, nil
}

func (s userService) GetUserByUUID(ctx context.Context, userUUID uuid.UUID) (*model.UserResponse, error) {
	user := model.User{}
	if err := s.userRepo.GetUserByUUID(ctx, &user, userUUID); err != nil {
		return nil, err
	}

	resp := model.UserResponse{}
	if err := helper.StructCopy(user, &resp); err != nil {
		return nil, err
	}

	return &resp, nil
}

func (s userService) GetUserByMemberID(ctx context.Context, memberID string) (*model.UserResponse, error) {
	user := model.User{}
	if err := s.userRepo.GetUserByMemberID(ctx, &user, memberID); err != nil {
		return nil, err
	}

	resp := model.UserResponse{}
	if err := helper.StructCopy(user, &resp); err != nil {
		return nil, err
	}

	return &resp, nil
}
