package pkg

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	model "tomato-api/internal/core/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	googleOauthConfig = &oauth2.Config{
		RedirectURL: "http://kao.monster" + ":8080/oauth/callback",
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

func GetGoogleCallbackInfo(oauthAT string) (*model.OAuth2, error) {
	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + oauthAT)
	if err != nil {
		return nil, fmt.Errorf("failed getting user info: %s", err.Error())
	}

	defer response.Body.Close()
	contents, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("failed reading response body: %s", err.Error())
	}

	oauth := model.OAuth2{}
	if err := json.Unmarshal(contents, &oauth); err != nil {
		return nil, err
	}

	return &oauth, nil
}

func GetCallbackInfo(state string, code string) ([]byte, error) {
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
