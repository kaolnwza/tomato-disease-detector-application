package repo

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type GinRouterS struct {
	*gin.Engine
}

// type Router interface {
// 	NewGinRouter() *GinRouter
// }

// func NewTomatoDiseaseRepo(db *sqlx.DB) repo.TomatoDiseaseRepository {
// 	return &tomatoDiseaseRepo{db: db}
// }

// func NewRouter() Router {
// 	return

// }

func NewGinRouter() *GinRouterS {
	r := gin.Default()

	corsConfig := cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8000"},
		AllowMethods:     []string{"GET, POST, PUT, DELETE"},
		AllowHeaders:     []string{"Origin, Content-Type, Accept, Authorization"},
		AllowCredentials: true,
	})

	r.Use(corsConfig)

	return &GinRouterS{r}
}

// func GinRouter() *GinRouterS {
// 	return NewGinRouter()
// }
