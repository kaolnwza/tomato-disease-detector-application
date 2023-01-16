package utils

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	uuid "github.com/satori/go.uuid"
)

func GenerateToken(userUUID uuid.UUID) (string, string, error) {
	accessTokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"access_uuid": uuid.NewV4().String(),
		"user_uuid":   userUUID.String(),
		// "exp":         time.Now().Add(time.Minute * 15).Unix(),
		"exp": time.Now().Add(time.Hour * 50000).Unix(),
	})

	accessToken, err := accessTokenClaims.SignedString([]byte(os.Getenv("AT_SECRET_KEY")))
	if err != nil {
		return "", "", err
	}

	refreshTokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"refresh_uuid": uuid.NewV4().String(),
		"user_uuid":    userUUID.String(),
		"exp":          time.Now().Add(time.Hour * 24).Unix(),
	})

	refreshToken, err := refreshTokenClaims.SignedString([]byte(os.Getenv("RT_SECRET_KEY")))
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func BearerToken(r *http.Request) string {
	bearToken := r.Header.Get("Authorization")

	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}

func tokenBearer(c *gin.Context) (*jwt.Token, error) {
	bearToken := c.Request.Header.Get("Authorization")

	getToken := strings.Split(bearToken, " ")
	if len(getToken) != 2 && getToken[0] != strings.ToLower("bearer") {
		return nil, fmt.Errorf("Header Authorization Failed")
	}

	token, err := jwt.Parse(getToken[1], func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("AT_SECRET_KEY")), nil
	})

	if err != nil {
		return nil, err
	}

	return token, nil
}

func TokenValid(c *gin.Context) (*jwt.Token, error) {
	token, err := tokenBearer(c)
	if err != nil {
		return nil, err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return nil, err
	}

	return token, nil
}

func SetTokenCookies(token string, c *gin.Context) {
	cookie := &http.Cookie{
		Name:   "token",
		Value:  token,
		MaxAge: 60 * 60,
	}

	http.SetCookie(c.Writer, cookie)
}

func RemoveTokenCookies(c *gin.Context) {
	cookie := &http.Cookie{
		Name:   "token",
		Value:  "",
		MaxAge: 0,
	}

	http.SetCookie(c.Writer, cookie)
}

func GetTokenCookies(c *gin.Context) string {
	for _, cookie := range c.Request.Cookies() {
		if cookie.Name == "token" {
			return cookie.Value
		}
	}
	return ""
}

func ExtractTokenOld(accessToken string) (*jwt.StandardClaims, error) {
	token, err := jwt.ParseWithClaims(accessToken, &jwt.StandardClaims{},
		func(t *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("AT_SECRET_KEY")), nil
		})
	if err != nil {
		return nil, err
	}

	claims := token.Claims.(*jwt.StandardClaims)

	return claims, nil
}

func ExtractToken(parseToken *jwt.Token) (jwt.MapClaims, error) {
	claims, ok := parseToken.Claims.(jwt.MapClaims)
	if !ok || !parseToken.Valid {
		return nil, fmt.Errorf("validate: invalid token")
	}

	return claims, nil
}
