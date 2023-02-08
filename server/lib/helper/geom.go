package helper

import (
	"fmt"
	"strings"
	model "tomato-api/internal/core/models"
)

func PointToLatLong(geom string) (string, string) {
	spl := []string{"", ""}
	if geom != "" {
		geom = strings.Trim(geom[1:], "]")
		spl = strings.Split(geom, ",")
	}

	return string(spl[0]), string(spl[1])
}

func LatLongToPoint(lat string, long string) string {
	return fmt.Sprintf("POINT(%s %s)", lat, long)
}

func LineToLatLong(line string) []model.LineString {
	ls := []model.LineString{}

	temp := ""
	for _, rune := range line[2 : len(line)-1] {
		str := string(rune)
		if str == "[" {
			temp = ""
			continue
		}

		if str == "]" {
			spl := strings.Split(temp, ",")
			ls = append(ls, model.LineString{spl[0], spl[1]})
			continue
		}

		temp += str
	}

	return ls
}
