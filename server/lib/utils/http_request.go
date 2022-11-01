package utils

import (
	"bytes"
	"io"
	"net/http"
	"os"
	"time"
)

func PostRequest(jsonData []byte) (*[]byte, error) {
	jsonBody := []byte(string(jsonData))
	bodyReader := bytes.NewReader(jsonBody)
	requestURL := "http://" + os.Getenv("FASTAPI_HOST_URL") + ":1234" + "/imgpred"

	req, err := http.NewRequest(http.MethodPost, requestURL, bodyReader)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

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
