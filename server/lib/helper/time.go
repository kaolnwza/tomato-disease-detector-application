package helper

import (
	"strings"
	"time"
)

func TimeFormatRFC3339(timeString string) (*time.Time, error) {
	if timeString != "" {

		timeString = strings.ReplaceAll(timeString, " 07:00", "")
		timeRFC, err := time.ParseInLocation("2006-01-02T15:04:05.999999", timeString, time.Local)
		if err != nil {
			return nil, err
		}

		return &timeRFC, nil
	}

	return nil, nil
}
