package model

// {"type":"Point","coordinates":[0,0]}
type LineString struct {
	Latitude  string `json:"latitude"`
	Longitude string `json:"longitude"`
}
type LineStringFloat struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
