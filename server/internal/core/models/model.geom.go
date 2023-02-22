package model

// {"type":"Point","coordinates":[0,0]}
type LineString struct {
	Latitude   string `json:"latitude"`
	Longtitude string `json:"longtitude"`
}
type LineStringFloat struct {
	Latitude   float64 `json:"latitude"`
	Longtitude float64 `json:"longtitude"`
}
