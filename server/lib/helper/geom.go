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

func JsonToLineString(linestring []*model.LineStringFloat) string {
	newLs := "'LINESTRING("
	for idx, str := range linestring {
		newLs += fmt.Sprintf("%f %f", str.Latitude, str.Longitude)

		if idx != len(linestring)-1 {
			newLs += ","
		}
	}
	return newLs + ")'"
}

func LineToLatLong(line string) *[]*model.LineString {
	ls := []*model.LineString{}

	temp := ""
	gotcha := false

	for _, rune := range line[2:] {
		str := string(rune)
		if str == "[" || gotcha {
			temp = ""
			gotcha = false
			continue
		}

		if str == "]" {
			gotcha = true
			spl := strings.Split(temp, ",")
			ls = append(ls, &model.LineString{spl[0], spl[1]})
			continue
		}

		temp += str
	}

	return &ls
}

// func LineSliceToLine(lineSlice string) string {

// }
