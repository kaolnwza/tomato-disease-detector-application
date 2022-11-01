package main

import (
	"fmt"
	"os"
	"tomato-api/apisrv/controller"
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

	controller.Test(r)

	// r.GET("/", services.Prediction)
	r.POST("/prediction", services.Prediction)
	r.POST("/", func(c *gin.Context) {

		c.JSON(200, "NICE!!")
	})

	r.Run(os.Getenv("GIN_HOST_URL") + ":8765")
	fmt.Println("Hello World!!")
}
