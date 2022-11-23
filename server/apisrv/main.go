package main

import (
	"fmt"
	"os"
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

	// controller.Test(r)

	// r.GET("/", services.Prediction)
	r.POST("/prediction", services.Prediction)
	r.GET("/", func(c *gin.Context) {

		c.JSON(200, "NICE!!")
	})

	r.GET("/host", func(c *gin.Context) {
		x := "IP: " + os.Getenv("HOST_URL")
		c.JSON(200, x)
	})
	fmt.Println("Hello World!!", os.Getenv("HOST_URL"))
	r.Run("0.0.0.0" + ":8765")

}
