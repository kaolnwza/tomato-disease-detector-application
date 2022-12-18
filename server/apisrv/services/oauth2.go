package services

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"
	"tomato-api/apisrv/model"
	"tomato-api/apisrv/repo"
	"tomato-api/lib/utils"

	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	uuid "github.com/satori/go.uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	googleOauthConfig = &oauth2.Config{
		RedirectURL: os.Getenv("HOST_URL") + ":8080/oauth/callback",
		// RedirectURL:  "http://localhost:8765/oauth/callback",
		ClientID:     os.Getenv("GOOGLE_AUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_AUTH_SECRET"),
		Scopes: []string{"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint: google.Endpoint,
	}

	oauthStateString = "random"
)

func GoogleLoginHandler(c *gin.Context) {
	url := googleOauthConfig.AuthCodeURL(oauthStateString)

	http.Redirect(c.Writer, c.Request, url, http.StatusTemporaryRedirect)

}

func GoogleCallbackHandler(c *gin.Context) {
	content, err := getUserInfo(c.Request.FormValue("state"), c.Request.FormValue("code"))
	if err != nil {
		fmt.Println(err.Error())
		http.Redirect(c.Writer, c.Request, "/oauth/", http.StatusTemporaryRedirect)
		return
	}

	oauth := model.OAuth2{}
	if err := json.Unmarshal(content, &oauth); err != nil {
		http.Redirect(c.Writer, c.Request, "/oauth/", http.StatusTemporaryRedirect)
		return
	}

	userFullName := strings.Split(oauth.Name, " ")
	user := model.NewUser{
		FirstName: userFullName[0],
		LastName:  userFullName[1],
		Email:     sql.NullString{String: oauth.Email, Valid: oauth.Email != ""},
	}

	tx, err := repo.DB.Beginx()
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := repo.FetchExistsUserByEmail(tx, &user, string(model.PROVIDER_TYPE_OAUTH2)); err != nil && err != sql.ErrNoRows {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if user.UserUUID == uuid.Nil {
		if err := repo.CreateUser(tx, &user, string(model.PROVIDER_TYPE_OAUTH2)); err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
	}

	at, _, err := utils.GenerateToken(user.UserUUID)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user":         user,
		"access_token": at,
	})

	// http.Redirect(c.Writer, c.Request, "v1/feed/", http.StatusOK)
}

func getUserInfo(state string, code string) ([]byte, error) {
	if state != oauthStateString {
		return nil, fmt.Errorf("invalid oauth state")
	}

	token, err := googleOauthConfig.Exchange(context.TODO(), code)
	if err != nil {
		return nil, fmt.Errorf("code exchange failed: %s", err.Error())
	}

	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}

	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed reading response body: %s", err.Error())
	}
	return contents, nil
}
