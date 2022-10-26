package utils

import "encoding/base64"

func BytesToString(bytes []byte) (*string, error) {
	rawDecodedText := base64.StdEncoding.EncodeToString(bytes)

	data, err := base64.StdEncoding.DecodeString(rawDecodedText)
	if err != nil {
		return nil, err
	}

	str := string(data)
	return &str, nil
}
