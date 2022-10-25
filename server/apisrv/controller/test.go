package controller

import (
	"fmt"
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

	type Dog struct {
		Msg string `json:"dog"`
	}
	r.POST("/bin", func(c *gin.Context) {

		var doh *Dog
		if err := c.ShouldBind(&doh); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": doh,
		})
	})

	r.POST("/upload", func(c *gin.Context) {
		// single file
		file, err := c.FormFile("file")
		fmt.Println("file", file)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		}
		// log.Println(file.Filename)

		// Upload the file to specific dst.
		c.SaveUploadedFile(file, "kuy.jpeg")

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})

	r.Run(port)
}
