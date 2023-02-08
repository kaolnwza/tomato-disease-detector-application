package helper

import (
	"fmt"
	"strings"
	log "tomato-api/lib/logs"
)

func GeomToLatLong(geom string) (string, string) {
	spl := []string{"", ""}
	if geom != "" {
		geom = strings.Trim(geom[1:], "]")
		spl = strings.Split(geom, ",")
	}

	return string(spl[0]), string(spl[1])
}

func LatLongToGeom(lat string, long string) string {
	log.Info(fmt.Sprintf("POINT(%s %s)", lat, long))
	return fmt.Sprintf("POINT(%s %s)", lat, long)
}
