package model

import (
	"time"

	"gorm.io/gorm"
)

type AuditFields struct {
	CreatedAt time.Time       `gorm:"autoCreateTime"`
	UpdatedAt time.Time       `gorm:"autoUpdateTime"`
	DeletedAt *gorm.DeletedAt `gorm:"index"`
}
