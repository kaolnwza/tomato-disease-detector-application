package log

import (
	"fmt"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var logger *zap.Logger

func init() {
	var err error

	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder

	logger, err = config.Build()
	if err != nil {
		fmt.Println("------------------- Logger Error! -------------------")
		fmt.Println(err)
		fmt.Println("-----------------------------------------------------")
	}
}

func Error(err error, fields ...zapcore.Field) {
	logger.Error(err.Error(), fields...)
}

func Info(msg string, fields ...zapcore.Field) {
	logger.Info(msg, fields...)
}
