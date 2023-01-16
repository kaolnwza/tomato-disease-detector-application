package model

import (
	uuid "github.com/satori/go.uuid"
)

type TomatoDisease struct {
	DiseaseUUID     uuid.UUID `db:"disease_uuid" json:"disease_uuid"`
	DiseaseName     string    `db:"disease_name" json:"disease_name"`
	DiseaseNameThai string    `db:"disease_name_th" json:"disease_name_th"`
	DiseaseCause    string    `db:"disease_cause" json:"disease_cause"`
	DiseaseSymptom  string    `db:"disease_symptom" json:"disease_symptom"`
	DiseaseEpidemic string    `db:"disease_epidemic" json:"disease_epidemic"`
	DiseaseResolve  string    `db:"disease_resolve" json:"disease_resolve"`
	ImagePath       string    `db:"image_path"`
}
