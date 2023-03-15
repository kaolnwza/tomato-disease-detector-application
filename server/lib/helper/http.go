package helper

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

func PostRequestImage(file multipart.File, fileHeader *multipart.FileHeader) (*[]byte, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile("file", fileHeader.Filename)
	io.Copy(part, file)
	writer.Close()

	requestURL := "http://" + os.Getenv("FASTAPI_HOST_URL") + ":1234" + "/imgpred2"
	// requestURL := "http://kao.monster:1234" + "/imgpred2"
	req, err := http.NewRequest(http.MethodPost, requestURL, body)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", writer.FormDataContentType())

	client := http.Client{
		Timeout: 30 * time.Second,
	}

	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	resp, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return &resp, nil
}
