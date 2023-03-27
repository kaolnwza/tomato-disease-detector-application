package model

import (
	"encoding/json"
	"time"

	uuid "github.com/google/uuid"
)

type TomatoDisease struct {
	DiseaseUUID     uuid.UUID `db:"disease_uuid"`
	DiseaseName     string    `db:"disease_name"`
	DiseaseNameThai string    `db:"disease_name_th"`
	DiseaseCause    string    `db:"disease_cause"`
	DiseaseSymptom  string    `db:"disease_symptom"`
	DiseaseEpidemic string    `db:"disease_epidemic"`
	DiseaseResolve  string    `db:"disease_resolve"`
	// UploadUUID      string    `db:"upload_uuid"`
	ImagePath string `db:"image_path"`
}

type TomatoDiseaseResponse struct {
	UUID     uuid.UUID                      `json:"uuid"`
	Name     string                         `json:"name"`
	NameThai string                         `json:"name_th"`
	ImageURL string                         `json:"image_url"`
	Inform   TomatoDiseaseInform            `json:"inform"`
	Images   *[]*TomatoDiseaseImageResponse `json:"images"`
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

type TomatoDiseaseImage struct {
	UUID        uuid.UUID `db:"uuid" json:"uuid"`
	DiseaseUUID uuid.UUID `db:"disease_uuid" json:"-"`
	UploadUUID  uuid.UUID `db:"upload_uuid" json:"upload_uuid"`
	ImagePath   string    `db:"image_path" json:"image_path"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

type TomatoDiseaseImageResponse struct {
	UUID      uuid.UUID `db:"uuid" json:"uuid"`
	ImageURI  string    `db:"image_uri" json:"image_uri"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type TomatoDiseaseInformData struct {
	Title string `json:"title"`
	Icon  string `json:"icon"`
	Data  string `json:"data"`
}

func (i TomatoDiseaseInformData) TypeSymptom(data string) TomatoDiseaseInformData {
	i.Title = "อาการ"
	i.Icon = "leaf"
	i.Data = data

	return i
}

func (i TomatoDiseaseInformData) TypeCause(data string) TomatoDiseaseInformData {
	i.Title = "สาเหตุ"
	i.Icon = "alert-circle-outline"
	i.Data = data

	return i
}

func (i TomatoDiseaseInformData) TypeEpidemic(data string) TomatoDiseaseInformData {
	i.Title = "การแพร่ระบาด"
	i.Icon = "virus-outline"
	i.Data = data

	return i
}
func (i TomatoDiseaseInformData) TypeResolve(data string) TomatoDiseaseInformData {
	i.Title = "การป้องกัน"
	i.Icon = "shield-check-outline"
	i.Data = data

	return i
}
