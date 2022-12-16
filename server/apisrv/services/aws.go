package services

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awsutil"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func S3Config() *s3.S3 {
	creds := credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS_KEY_ID"), os.Getenv("AWS_SECRET_ACCESS_KEY"), os.Getenv("AWS_SESSION_TOKEN"))
	_, err := creds.Get()
	if err != nil {
		// handle error
	}
	cfg := aws.NewConfig().WithRegion("us-east-1").WithCredentials(creds)
	svc := s3.New(session.New(), cfg)

	return svc
}

func TestS3() {
	svc := S3Config()

	file, err := os.Open("/Users/kaolnwza/Developer/tomato-disease-detector-application/server/apisrv/services/test.jpeg")
	if err != nil {
		fmt.Println("err", err)
		// handle error
	}
	defer file.Close()
	fileInfo, _ := file.Stat()
	size := fileInfo.Size()
	buffer := make([]byte, size) // read file content to buffer

	file.Read(buffer)
	fileBytes := bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)
	// path := "/media/" + file.Name()
	path := "/media/" + time.Now().String() + ".jpeg"
	params := &s3.PutObjectInput{
		Bucket:        aws.String(os.Getenv("AWS_BUCKET")),
		Key:           aws.String(path),
		Body:          fileBytes,
		ContentLength: aws.Int64(size),
		ContentType:   aws.String(fileType),
	}
	resp, err := svc.PutObject(params)
	if err != nil {
		fmt.Println("err2", err)
		// handle error
	}
	fmt.Printf("response %s", awsutil.StringValue(resp))
}

func S3Get() {
	svc := S3Config()

	filename := "2022-11-17 10:38:15.737135 +0700 +07 m=+0.015388584.jpeg"
	fmt.Println("Downloading: ", filename)

	resp, err := svc.GetObject(&s3.GetObjectInput{
		Bucket: aws.String(os.Getenv("AWS_BUCKET")),
		Key:    aws.String("/media/" + filename),
	})

	if err != nil {
		fmt.Println("err", err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	err = ioutil.WriteFile(filename, body, 0644)
	if err != nil {
		fmt.Println("err resp", err)
	}
}
