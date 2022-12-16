package main

import (
	"fmt"
	"os"
	"tomato-api/apisrv/model"
	"tomato-api/apisrv/services"
	"tomato-api/lib/config"
	"tomato-api/lib/database"

	"github.com/gin-gonic/gin"
)

func main() {

	// url := os.Getenv("HOST_URL") + ":8765"
	// controller.Controller(url)
	// controller.r

	r := gin.Default()
	r.Use(config.CorsConfig())
	r.SetTrustedProxies([]string{"*"})

	// var db = database.DatabaseConnecting()

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, "NICE!!")
	})

	r.GET("/host", func(c *gin.Context) {
		x := "IP: " + os.Getenv("HOST_URL")
		c.JSON(200, x)
	})

	v1 := r.Group("/v1")
	v1.POST("/prediction", services.Prediction)
	// v1.POST("/gettest", services.GetAllUserFarmHandler)

	v1.GET("/disease", services.GetDiseasesInfoHandler)

	v1.GET("/testdb", func(ctx *gin.Context) {
		db := database.DatabaseConnecting()

		stt := []*model.UserFarm{}

		s := `SELECT user_farm_uuid, 
					farm_uuid, 
					user_farm_role, 
					users.user_uuid as "user.user_uuid" ,
					users.first_name as "user.first_name" ,
					users.last_name as "user.last_name" 
			FROM user_farm
		LEFT JOIN users ON users.user_uuid = user_farm.user_uuid`

		if err := db.Select(&stt, s); err != nil {
			fmt.Println("err", err)
			ctx.JSON(500, err)
			return
		}

		ctx.JSON(200, stt)
	})

	fmt.Println("Hello World!!", os.Getenv("HOST_URL"))
	r.Run("0.0.0.0" + ":8765")

}
