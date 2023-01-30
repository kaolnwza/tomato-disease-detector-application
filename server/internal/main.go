package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	db "tomato-api/internal/adapters/database"
	rapi "tomato-api/internal/adapters/restapi"
	service "tomato-api/internal/core/services"
	handler "tomato-api/internal/infra/handlers"
	"tomato-api/internal/infra/repositories/pgsql"
)

func main() {

	r := rapi.NewGinRouter()
	middleware := rapi.NewGinMiddleware()

	pg := db.PostgresTomato()
	pgTx := db.NewPostgresRepo(pg)

	tmtDiseaseRepo := pgsql.NewTomatoDiseaseRepo(pgTx)
	tmtDiseaseSvc := service.NewTomatoDiseaseServices(tmtDiseaseRepo, pgTx)
	tmtDiseaseHandler := handler.NewTomatoDiseaseHandler(tmtDiseaseSvc)

	userRepo := pgsql.NewUserRepo(pgTx)
	userSvc := service.NewUserService(userRepo, pgTx)
	userHandler := handler.NewUserHandler(userSvc)

	uploadRepo := pgsql.NewUploadRepo(pgTx)
	uploadSvc := service.NewUploadService(uploadRepo, pgTx)
	uploadHandler := handler.NewUploadHandler(uploadSvc)

	tmtLogRepo := pgsql.NewTomatoLogRepo(pgTx)
	tmtLogSvc := service.NewTomatoLogService(tmtLogRepo, pgTx, uploadSvc)
	tmtLogHandler := handler.NewTomatoLogHandler(tmtLogSvc)

	predSvc := service.NewPredictionService()
	predHandler := handler.NewPredictionHandler(predSvc)

	r.GET("/jwt/:user_uuid", userHandler.NewAccessToken)

	oauth := r.GROUP("/oauth")
	oauth.POST("/login", userHandler.GoogleLoginHandler)

	v1 := r.GROUP("/v1", middleware)
	{
		v1.POST("/upload", uploadHandler.UploadFile)
		v1.POST("/prediction", predHandler.PredictionTomato)
		disease := v1.GROUP("/disease")
		{
			disease.GET("", tmtDiseaseHandler.GetTomatoDiseasesHandler)
			disease.GET("/:name", tmtDiseaseHandler.GetTomatoDiseaseByNameHandler)

		}

		farm := v1.GROUP("/farm", middleware)
		{
			farmUUID := farm.GROUP("/:farm_uuid")
			{
				farmUUID.GET("", tmtLogHandler.GetTomatoLogByFarmUUID)
				farmUUID.POST("/log", tmtLogHandler.CreateTomatoLogByFarmUUID)
			}
		}

		log := v1.GROUP("/log", middleware)
		{
			log.GET("", tmtLogHandler.GetTomatoLogByUserUUID)
			logUUID := log.GROUP("/:log_uuid")
			{
				logUUID.GET("", tmtLogHandler.GetTomatoLogByLogUUID)
			}
		}
	}

	/*

		gracefully shutdown


	*/
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	s := &http.Server{
		Addr:           ":8765",
		Handler:        r,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	go func() {
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	<-ctx.Done()
	stop()
	fmt.Println("shutting down gracefully, press Ctrl+C again to force")

	timeoutCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := s.Shutdown(timeoutCtx); err != nil {
		fmt.Println(err)
	}
}
