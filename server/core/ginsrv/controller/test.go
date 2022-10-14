package controller

import (
	"fmt"
	"net/http"
	"tomato-api/core/grpcsrv/proto/pb"
	"tomato-api/lib/config"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

func Controller(port string) {
	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		panic(err)
	}

	client := pb.NewGreeterClient(conn)

	r := gin.Default()

	r.Use(config.CorsConfig())
	r.SetTrustedProxies([]string{"*"})

	r.GET("/grpc", func(ctx *gin.Context) {
		req := &pb.HelloRequest{Name: "prayuth"}
		if response, err := client.SayHello(ctx, req); err == nil {
			ctx.JSON(http.StatusOK, gin.H{
				"result": fmt.Sprint(response.Message),
			})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	})

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
