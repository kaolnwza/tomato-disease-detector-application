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

	"github.com/gin-gonic/gin"
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

	usrFarmRepo := pgsql.NewUserFarmRepository(pgTx)
	usrFarmSvc := service.NewUserFarmService(pgTx, usrFarmRepo)
	usrFarmHdr := handler.NewUserFarmHandler(usrFarmSvc)

	tmtLogRepo := pgsql.NewTomatoLogRepo(pgTx)
	tmtLogSvc := service.NewTomatoLogService(tmtLogRepo, pgTx, uploadSvc, usrFarmSvc)
	tmtLogHandler := handler.NewTomatoLogHandler(tmtLogSvc)

	farmRepo := pgsql.NewFarmRepository(pgTx)
	farmSvc := service.NewFarmService(pgTx, farmRepo)
	farmHdr := handler.NewFarmHandler(farmSvc)

	predSvc := service.NewPredictionService(tmtDiseaseSvc)
	predHandler := handler.NewPredictionHandler(predSvc)

	health := handler.NewHealthHandler()

	r.Use(gin.LoggerWithConfig(gin.LoggerConfig{
		SkipPaths: []string{"/health"},
	}))

	r.GET("/jwt/:user_uuid", userHandler.NewAccessToken)

	r.GET("/health", health.HealthCheck)

	oauth := r.GROUP("/oauth")
	oauth.POST("/login", userHandler.GoogleLoginHandler)

	v1 := r.GROUP("/v1", middleware)
	{
		v1.POST("/upload", uploadHandler.UploadFile)
		v1.POST("/prediction", predHandler.PredictionTomato)
		disease := v1.GROUP("/disease", middleware)
		{
			disease.GET("", tmtDiseaseHandler.GetTomatoDiseasesHandler)
			disease.POST("/", tmtDiseaseHandler.GetTomatoDiseasesHandler)
			disease.GET("/:name", tmtDiseaseHandler.GetTomatoDiseaseByNameHandler)

		}

		farm := v1.GROUP("/farms", middleware)
		{
			farm.GET("", farmHdr.GetAllFarmHandler)
			farm.POST("", farmHdr.CreateFarmHandler)
			// farm.PUT("", farmHdr.UpdateFarmHandler)
			farmUUID := farm.GROUP("/:farm_uuid")
			{
				farmUUID.GET("/log", tmtLogHandler.GetTomatoLogByFarmUUID)
				farmUUID.POST("/log", tmtLogHandler.CreateTomatoLogByFarmUUID)
				farmUUID.GET("/summary", tmtLogHandler.GetClusterByFarmUUIDHandler)
				farmUUID.GET("/percentage", tmtLogHandler.GetLogsPercentageByFarmUUIDHandler)
				farmUUID.GET("/role", usrFarmHdr.FetchFarmRoleHandler)

				farmUser := farmUUID.GROUP("/users")
				{
					farmUser.POST("", usrFarmHdr.AddUserFarmHandler)
					farmUser.GET("", usrFarmHdr.GetAllFarmUserHandler)
					farmUserUUID := farmUser.GROUP("/:user_uuid")
					{
						farmUserUUID.PUT("/status", usrFarmHdr.ActivateUserFarmHandler)
						farmUserUUID.PUT("/role", usrFarmHdr.UpdateUserFarmRoleHandler)
					}
				}
			}
		}

		log := v1.GROUP("/logs", middleware)
		{
			logUUID := log.GROUP("/:log_uuid")
			{
				logUUID.GET("", tmtLogHandler.GetTomatoLogByLogUUID)
				logUUID.PUT("", tmtLogHandler.UpdateByLogUUIDHandler)
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
