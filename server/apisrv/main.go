package main

import (
	"fmt"
	"os"
	"tomato-api/apisrv/middleware"
	"tomato-api/apisrv/services"
	"tomato-api/lib/config"

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

	oauth := r.Group("/oauth")
	oauth.GET("/login", services.GoogleLoginHandler)
	oauth.GET("/callback", services.GoogleCallbackHandler)

	// r.GET("/im", services.Prediction)

	v1 := r.Group("/v1", middleware.Middleware())

	v1.POST("/prediction", services.Prediction)
	v1.POST("/base64img", services.Prediction)
	v1.POST("/log", services.CreateTomatoLogHandler)
	v1.GET("/log", services.FetchTomatoLogByUserUUIDHandler)
	// v1.POST("/gettest", services.GetAllUserFarmHandler)

	v1.GET("/disease", services.GetDiseasesInfoHandler)

	fmt.Println("Hello World!!", os.Getenv("HOST_URL"))
	r.Run("0.0.0.0" + ":8765")

}
