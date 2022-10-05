package controller

import (
	"net/http"
	"tomato-api/lib/config"

	"github.com/gin-gonic/gin"
)

func Controller(port string) {
	r := gin.Default()

	r.Use(config.CorsConfig())
	r.SetTrustedProxies([]string{"*"})

	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"msg": "Hello UNIVERSE!!",
		})
	})
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.Run(port)
}
