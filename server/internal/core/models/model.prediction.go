package model

type PredictionResponse struct {
	PredictionResult string                 `json:"prediction_result"`
	PredictionScore  float64                `json:"prediction_score"`
	DiseaseInfo      *TomatoDiseaseResponse `json:"disease_info"`
}
