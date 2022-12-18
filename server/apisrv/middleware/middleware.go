package middleware

import (
	"context"
	"fmt"
	"net/http"
	"tomato-api/lib/utils"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
)

func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := utils.TokenValid(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}

		claims, err := utils.ExtractToken(token)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			c.Abort()
			return
		}

		contextUserUUID, _ := uuid.FromString(fmt.Sprintf("%s", claims["user_uuid"]))
		ctx := context.WithValue(c.Request.Context(), "access_user_uuid", contextUserUUID)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}
