package helper

import (
	"encoding/base64"
	"strings"
)

func Base64ToString(bytes []byte) (*string, error) {
	rawDecodedText := base64.StdEncoding.EncodeToString(bytes)

	data, err := base64.StdEncoding.DecodeString(rawDecodedText)
	if err != nil {
		return nil, err
	}

	str := string(data)
	newStr := strings.ReplaceAll(str, "\"", "")
	return &newStr, nil
}
