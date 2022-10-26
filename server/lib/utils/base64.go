package utils

import (
	"encoding/base64"
	"image"
	"image/jpeg"
	"os"
	"strings"
	"time"
)

func Base64ToImg(path string, base64Str string) error {
	reader := base64.NewDecoder(base64.StdEncoding, strings.NewReader(base64Str))
	m, _, err := image.Decode(reader)
	if err != nil {
		return err
	}

	time := time.Now()
	pngFilename := path + time.String() + ".jpg"
	f, err := os.OpenFile(pngFilename, os.O_WRONLY|os.O_CREATE, 0777)
	if err != nil {
		return err
	}

	err = jpeg.Encode(f, m, &jpeg.Options{Quality: 75})
	if err != nil {
		return err
	}
	defer f.Close()

	return nil
}
