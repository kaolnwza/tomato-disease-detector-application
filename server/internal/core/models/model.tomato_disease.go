package model

import (
	"encoding/json"
	"time"

	uuid "github.com/google/uuid"
)

type TomatoDiseaseName string

const (
	TOMATO_DISEASE_NAME_SPIDER_MITES           TomatoDiseaseName = "Spider Mites"
	TOMATO_DISEASE_NAME_MOSAIC_VIRUS           TomatoDiseaseName = "Mosaic Virus"
	TOMATO_DISEASE_NAME_LEAF_MOLD              TomatoDiseaseName = "Leaf Mold"
	TOMATO_DISEASE_NAME_SEPTORIA_LEAF_SPOT     TomatoDiseaseName = "Septoria Leaf Spot"
	TOMATO_DISEASE_NAME_BACTERIAL_SPOT         TomatoDiseaseName = "Bacterial Spot"
	TOMATO_DISEASE_NAME_LATE_BLIGHT            TomatoDiseaseName = "Late Blight"
	TOMATO_DISEASE_NAME_EARLY_BLIGHT           TomatoDiseaseName = "Early Blight"
	TOMATO_DISEASE_NAME_HEALTHY                TomatoDiseaseName = "Healthy"
	TOMATO_DISEASE_NAME_YELLOW_LEAF_CURL_VIRUS TomatoDiseaseName = "Yellow Leaf Curl Virus"
)

var TomatoDiseaseNameMap = map[string]TomatoDiseaseName{
	"Spider Mites":           TOMATO_DISEASE_NAME_SPIDER_MITES,
	"Mosaic Virus":           TOMATO_DISEASE_NAME_MOSAIC_VIRUS,
	"Leaf Mold":              TOMATO_DISEASE_NAME_LEAF_MOLD,
	"Septoria Leaf Spot":     TOMATO_DISEASE_NAME_SEPTORIA_LEAF_SPOT,
	"Bacterial Spot":         TOMATO_DISEASE_NAME_BACTERIAL_SPOT,
	"Late Blight":            TOMATO_DISEASE_NAME_LATE_BLIGHT,
	"Early Blight":           TOMATO_DISEASE_NAME_EARLY_BLIGHT,
	"Healthy":                TOMATO_DISEASE_NAME_HEALTHY,
	"Yellow Leaf Curl Virus": TOMATO_DISEASE_NAME_YELLOW_LEAF_CURL_VIRUS,
}

type TomatoDiseaseDB struct {
	DiseaseUUID     uuid.UUID `db:"disease_uuid" json:"disease_uuid"`
	DiseaseName     string    `db:"disease_name" json:"disease_name"`
	DiseaseNameThai string    `db:"disease_name_th" json:"disease_name_th"`
	DiseaseCause    string    `db:"disease_cause" json:"disease_cause"`
	DiseaseSymptom  string    `db:"disease_symptom" json:"disease_symptom"`
	DiseaseEpidemic string    `db:"disease_epidemic" json:"disease_epidemic"`
	DiseaseResolve  string    `db:"disease_resolve" json:"disease_resolve"`
	ImagePath       *string   `db:"image_path" json:"image_path"`
}

type TomatoDisease struct {
	DiseaseUUID     uuid.UUID `db:"disease_uuid" json:"disease_uuid"`
	DiseaseName     string    `db:"disease_name" json:"disease_name"`
	DiseaseNameThai string    `db:"disease_name_th" json:"disease_name_th"`
	DiseaseCause    string    `db:"disease_cause" json:"disease_cause"`
	DiseaseSymptom  string    `db:"disease_symptom" json:"disease_symptom"`
	DiseaseEpidemic string    `db:"disease_epidemic" json:"disease_epidemic"`
	DiseaseResolve  string    `db:"disease_resolve" json:"disease_resolve"`
	ImagePath       *string   `db:"image_path" json:"image_path"`
}

type TomatoDiseaseResponse struct {
	UUID     uuid.UUID           `json:"uuid"`
	Name     string              `json:"name"`
	NameThai string              `json:"name_th"`
	ImageURL *string             `json:"image_url"`
	Inform   TomatoDiseaseInform `json:"inform"`
}

func NewTomatoDiseaseInform() *TomatoDiseaseInform {
	return &TomatoDiseaseInform{}
}

type TomatoDiseaseInform struct {
	InformData []*TomatoDiseaseInformData `json:"inform_data"`
}

func (t *TomatoDiseaseInform) MarshalJSON() ([]byte, error) {
	type TomatoDiseaseInformP TomatoDiseaseInform

	return json.Marshal(&struct {
		InformTitle string `json:"inform_title"`
		InformIcon  string `json:"inform_icon"`
		*TomatoDiseaseInformP
	}{
		InformTitle:          "ข้อมูลโรค",
		InformIcon:           "virus",
		TomatoDiseaseInformP: (*TomatoDiseaseInformP)(t),
	})
}

type TomatoDiseaseImageDB struct {
	UUID        uuid.UUID `db:"uuid" json:"uuid"`
	DiseaseUUID uuid.UUID `db:"disease_uuid" json:"disease_uuid"`
	UploadUUID  uuid.UUID `db:"upload_uuid" json:"upload_uuid"`
	ImagePath   string    `db:"image_path" json:"image_path"`
	Column      string    `db:"column" json:"column"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

type TomatoDiseaseImage struct {
	UUID        uuid.UUID `db:"uuid" json:"uuid"`
	DiseaseUUID uuid.UUID `db:"disease_uuid" json:"disease_uuid"`
	UploadUUID  uuid.UUID `db:"upload_uuid" json:"upload_uuid"`
	ImagePath   string    `db:"image_path" json:"image_path"`
	Column      string    `db:"column" json:"column"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

type TomatoDiseaseImageResponse struct {
	UUID      uuid.UUID `db:"uuid" json:"uuid"`
	ImageURI  string    `db:"image_uri" json:"image_uri"`
	Column    string    `db:"column" json:"column"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type TomatoDiseaseInformData struct {
	Title  string                      `json:"title"`
	Icon   string                      `json:"icon"`
	Data   string                      `json:"data"`
	Images *[]TomatoDiseaseInformImage `json:"images"`
}

type TomatoDiseaseInformImage struct {
	UUID     uuid.UUID `json:"uuid"`
	ImageURI string    `json:"image_uri"`
}

func (i TomatoDiseaseInformData) TypeSymptom(data string, images []TomatoDiseaseInformImage) TomatoDiseaseInformData {
	i.Title = "อาการ"
	i.Icon = "leaf"
	i.Data = data
	i.Images = &images

	return i
}

func (i TomatoDiseaseInformData) TypeCause(data string, images []TomatoDiseaseInformImage) TomatoDiseaseInformData {
	i.Title = "สาเหตุ"
	i.Icon = "alert-circle-outline"
	i.Data = data
	i.Images = &images

	return i
}

func (i TomatoDiseaseInformData) TypeEpidemic(data string, images []TomatoDiseaseInformImage) TomatoDiseaseInformData {
	i.Title = "การแพร่ระบาด"
	i.Icon = "virus-outline"
	i.Data = data
	i.Images = &images

	return i
}
func (i TomatoDiseaseInformData) TypeResolve(data string, images []TomatoDiseaseInformImage) TomatoDiseaseInformData {
	i.Title = "การป้องกัน"
	i.Icon = "shield-check-outline"
	i.Data = data
	i.Images = &images

	return i
}
