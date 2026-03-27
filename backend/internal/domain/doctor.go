package domain

const (
	Sunday    DayOfWeek = 0
	Monday    DayOfWeek = 1
	Tuesday   DayOfWeek = 2
	Wednesday DayOfWeek = 3
	Thursday  DayOfWeek = 4
	Friday    DayOfWeek = 5
	Saturday  DayOfWeek = 6
)

func (d DayOfWeek) IsValid() bool {
	return d >= Sunday && d <= Saturday
}

type Doctor struct {
	ID        UUID
	ClinicID  UUID
	Name      string
	Specialty string
	Email     Email
	Phone     string
	Active    bool

	AuditFields

	Clinic    Clinic
	Schedules []DoctorSchedule
}

type DoctorSchedule struct {
	ID        UUID
	DoctorID  UUID
	DayOfWeek DayOfWeek
	StartTime string
	EndTime   string

	AuditFields
}
