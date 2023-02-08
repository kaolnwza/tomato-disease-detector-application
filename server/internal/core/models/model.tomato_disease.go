package model

import (
	"encoding/json"

	uuid "github.com/satori/go.uuid"
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
	Name     string              `json:"name"`
	NameThai string              `json:"name_th"`
	ImageURL string              `json:"image_url"`
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
