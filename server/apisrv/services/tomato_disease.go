package services

import (
	"encoding/json"
	"net/http"
	"os"
	"tomato-api/apisrv/model"
	"tomato-api/apisrv/repo"

	"github.com/gin-gonic/gin"
)

type TomatoDiseaseResponse struct {
	Name     string              `json:"name"`
	NameThai string              `json:"name_th"`
	ImageURL string              `json:"image_url"`
	Inform   TomatoDiseaseInform `json:"inform"`
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

func GetDiseasesInfoHandler(c *gin.Context) {
	disease := []*model.TomatoDisease{}

	if err := repo.GetTomatoDisease(repo.DB, &disease); err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	resp := []*TomatoDiseaseResponse{}

	ch := make(chan error, len(disease))

	for _, i := range disease {
		go func(i *model.TomatoDisease) {
			inform := &TomatoDiseaseInform{}

			uri, err := GenerateImageURI(c, os.Getenv("GCS_BUCKET_1"), i.ImagePath)
			if err != nil {
				c.JSON(http.StatusInternalServerError, err.Error())
				return
			}

			inform.informGenerator(i)

			respT := &TomatoDiseaseResponse{
				ImageURL: uri,
				Name:     i.DiseaseName,
				NameThai: i.DiseaseNameThai,
				Inform:   *inform,
			}

			resp = append(resp, respT)
			ch <- nil
		}(i)

	}

	for i := 0; i < len(disease); i++ {
		<-ch
	}

	c.JSON(http.StatusOK, resp)

}

func (inform *TomatoDiseaseInform) informGenerator(disease *model.TomatoDisease) {
	info := &TomatoDiseaseInformData{}
	symp := info.TypeSymptom(disease.DiseaseSymptom)
	cause := info.TypeCause(disease.DiseaseCause)
	epidemic := info.TypeEpidemic(disease.DiseaseEpidemic)
	resolve := info.TypeResolve(disease.DiseaseResolve)

	inform.InformData = append(inform.InformData, &symp, &cause, &epidemic, &resolve)
}
