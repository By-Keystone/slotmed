package domain

import (
	"regexp"
	"time"

	"github.com/google/uuid"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

func isValidEmail(e Email) bool {
	return emailRegex.MatchString(string(e))
}

func (e Email) IsValid() bool {
	return isValidEmail(e)
}

type UUID = uuid.UUID
type Email string
type DayOfWeek int
type UserRole string

type AuditFields struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt *time.Time
}

type AppointmentStatus string

const (
	ADMIN  UserRole = "ADMIN"
	DOCTOR UserRole = "DOCTOR"
)
