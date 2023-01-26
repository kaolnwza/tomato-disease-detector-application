package model

import (
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

// type TomatoDiseaseResponse struct {
// 	DiseaseUUID     uuid.UUID `db:"disease_uuid"`
// 	DiseaseName     string    `db:"disease_name"`
// 	DiseaseNameThai string    `db:"disease_name_th"`
// 	DiseaseCause    string    `db:"disease_cause"`
// 	DiseaseSymptom  string    `db:"disease_symptom"`
// 	DiseaseEpidemic string    `db:"disease_epidemic"`
// 	DiseaseResolve  string    `db:"disease_resolve"`
// 	UploadUUID      string    `db:"upload_uuid"`
// }
