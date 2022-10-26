package utils

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"time"
)

func PostRequest(jsonData []byte) (*[]byte, error) {
	// x, _ := json.Marshal(jsonData)
	// c.JSON(http.StatusOK, md)
	jsonBody := []byte(string(jsonData))

	bodyReader := bytes.NewReader(jsonBody)

	requestURL := fmt.Sprintf("http://localhost:%d/imgpred", 1234)
	// requestURL := fmt.Sprintf("http://localhost:%d/imgkub", 1234)

	req, err := http.NewRequest(http.MethodPost, requestURL, bodyReader)
	if err != nil {
		fmt.Printf("client: could not create request: %s\n", err)
		// c.String(http.StatusInternalServerError, err.Error())
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	client := http.Client{
		Timeout: 30 * time.Second,
	}

	res, err := client.Do(req)
	if err != nil {
		fmt.Printf("client: error making http request: %s\n", err)
		// c.String(http.StatusInternalServerError, err.Error())
		return nil, err
	}
	// fmt.Println("res", res.Body)

	resp, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("err3", err)
		return nil, err
	}

	return &resp, nil
}
