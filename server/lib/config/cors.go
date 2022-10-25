package config

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CorsConfig() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8000"},
		AllowMethods:     []string{"GET, POST, PUT, DELETE"},
		AllowHeaders:     []string{"Origin, Content-Type, Accept, Authorization"},
		AllowCredentials: true,
	})

}
