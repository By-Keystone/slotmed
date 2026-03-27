package postgres

import (
	"context"
	"errors"

	"github.com/clinica-citas/backend/internal/domain"
	"github.com/clinica-citas/backend/internal/port"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) port.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) GetByAuthId(ctx context.Context, authId string) (*domain.User, error) {
	var user domain.User

	if err := r.db.WithContext(ctx).First(&user, "auth_id = ?", authId).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, port.ErrNotFound
		}

		return nil, err
	}

	return &user, nil
}
