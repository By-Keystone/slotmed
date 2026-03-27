package usecase

import "time"

func parseHHMM(s string) (time.Time, error) {
	return time.Parse("15:04", s)
}

func parseDate(s string) (time.Time, error) {
	return time.Parse("2006-01-02", s)
}
