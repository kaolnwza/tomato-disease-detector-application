package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"time"
	"tomato-api/lib/utils"

	"github.com/gin-gonic/gin"
)

// func Controller(port string) {
// conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
// if err != nil {
// 	panic(err)
// }

// client := pb.NewGreeterClient(conn)
func Test(r *gin.Engine) {
	// r := gin.Default()

	// r.Use(config.CorsConfig())
	// r.SetTrustedProxies([]string{"*"})

	// r.GET("/grpc", func(ctx *gin.Context) {
	// 	req := &pb.HelloRequest{Name: "prayuth"}
	// 	if response, err := client.SayHello(ctx, req); err == nil {
	// 		ctx.JSON(http.StatusOK, gin.H{
	// 			"result": fmt.Sprint(response.Message),
	// 		})
	// 	} else {
	// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	}
	// })

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
			"message": "done",
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
	r.POST("/upload3", func(c *gin.Context) {
		// single file
		file, header, err := c.Request.FormFile("file")
		fmt.Println("file", file)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		}

		// log.Println(file.Filename)
		out, err := os.Create(header.Filename)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		defer out.Close()
		_, err = io.Copy(out, file)
		if err != nil {
			c.String(http.StatusInternalServerError, err.Error())
			return
		}
		// Upload the file to specific dst.
		// c.SaveUploadedFile(file, "kuy.jpeg")

		c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", header.Filename))
	})

	type Form struct {
		File *multipart.FileHeader `form:"file" binding:"required"`
	}

	r.POST("/upload2", func(c *gin.Context) {
		// single file
		var form Form
		err := c.ShouldBind(&form)
		if err != nil {
			fmt.Println("err", err)
		}
		x, _ := json.Marshal(form)
		fmt.Println(string(x))

		// err = c.SaveFile(form.File, "yesped.jpeg")
		// if err != nil {
		// 	fmt.Println("err2", err)
		// }
		// err = c.SaveUploadedFile(form.File, "yesped.jpeg")
		// if err != nil {
		// 	fmt.Println("err2", err)
		// }

		// c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
	})
	r.POST("/pyimg", func(c *gin.Context) {
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

	type Yesped struct {
		Img string `json:"img"`
	}
	r.POST("/ec", func(c *gin.Context) {
		var yp *Yesped
		// body, _ := c.GetRawData()
		if err := c.ShouldBindJSON(&yp); err != nil {
			c.JSON(500, err.Error())
			return
		}

		if err := utils.Base64ToImg("../lib/tmp/", yp.Img); err != nil {
			c.JSON(500, err.Error())
			return
		}

		byyt, err := json.Marshal(yp)
		if err != nil {
			c.JSON(500, err.Error())
			return
		}

		resp, err := utils.PostRequest(byyt)
		if err != nil {
			c.JSON(500, err.Error())
			return
		}

		respStr, err := utils.BytesToString(*resp)
		if err != nil {
			c.JSON(500, err.Error())
			return
		}

		c.JSON(200, respStr)

	})

	type What struct {
		Name string `json:"name"`
	}
	r.POST("/pt", func(c *gin.Context) {
		fmt.Println(c.Request, c.Request.Response)
		md := What{Name: "prayuth"}
		x, _ := json.Marshal(md)
		// c.JSON(http.StatusOK, md)
		jsonBody := []byte(string(x))

		bodyReader := bytes.NewReader(jsonBody)

		requestURL := fmt.Sprintf("http://localhost:%d/what", 1234)

		req, err := http.NewRequest(http.MethodPost, requestURL, bodyReader)
		if err != nil {
			fmt.Printf("client: could not create request: %s\n", err)
			// c.String(http.StatusInternalServerError, err.Error())
			return
		}
		req.Header.Set("Content-Type", "application/json")

		client := http.Client{
			Timeout: 30 * time.Second,
		}

		res, err := client.Do(req)
		if err != nil {
			fmt.Printf("client: error making http request: %s\n", err)
			// c.String(http.StatusInternalServerError, err.Error())
			return
		}
		// fmt.Println("res", res.Body)

		bytes, err := io.ReadAll(res.Body)
		if err != nil {
			fmt.Println("err3", err)
		}

		fmt.Println(string(bytes))

		c.JSON(http.StatusOK, string(bytes))

	})

	// r.GET("/db", func(c *gin.Context) {
	// 	err := repository.TestFuck555()
	// 	if err != nil {
	// 		fmt.Println("err", err)
	// 	}
	// 	fmt.Println("x", err)
	// })

	// r.GET("/dbis", func(c *gin.Context) {
	// 	repository.TestFuckLOL()

	// })

	// }
}
