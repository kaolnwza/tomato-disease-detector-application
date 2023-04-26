package handler

import (
	"net/http"
	port "tomato-api/internal/ports"
)

type expoHdr struct {
}

func NewExpoHandler() expoHdr {
	return expoHdr{}
}

func (h expoHdr) ExpoWebpageHandler(c port.Context) {
	http.Redirect(c.Writer(), c.Request(), "https://kaolnwza.github.io/tomato-expo.github.io", http.StatusSeeOther)
}
