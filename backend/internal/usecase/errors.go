package usecase

import "errors"

var (
	ErrClinicNotFound          = errors.New("clinic not found")
	ErrDoctorNotFound          = errors.New("doctor not found")
	ErrAppointmentNotFound     = errors.New("appointment not found")
	ErrInvalidTime             = errors.New("time must be in HH:MM format")
	ErrStartAfterEnd           = errors.New("start_time must be before end_time")
	ErrScheduleOverlap         = errors.New("schedule blocks overlap on the same day")
	ErrInvalidDayOfWeek        = errors.New("day_of_week must be between 0 (Sunday) and 6 (Saturday)")
	ErrInvalidSlotDuration     = errors.New("slot_duration_minutes must be greater than 0")
	ErrSlotNotAvailable        = errors.New("the requested time slot is not available")
	ErrSlotOutsideSchedule     = errors.New("the requested time slot is outside the doctor's schedule")
	ErrInvalidDate             = errors.New("date must be in YYYY-MM-DD format")
	ErrPastDate                = errors.New("appointment date must be in the future")
	ErrInvalidStatusTransition = errors.New("invalid status transition")
)
