package repo

import (
	"context"
	"net/http"

	"github.com/google/uuid"
)

type Context interface {
	Request() *http.Request
	Writer() ResponseWriter
	Bind(interface{}) error
	JSON(int, interface{})
	Abort()
	AccessUserUUID() uuid.UUID
	Ctx() context.Context
	Param(string) string
}

type ResponseWriter interface {
	http.ResponseWriter
	http.Hijacker
	http.Flusher
	http.CloseNotifier

	// Status returns the HTTP response status code of the current request.
	Status() int

	// Size returns the number of bytes already written into the response http body.
	// See Written()
	Size() int

	// WriteString writes the string into the response body.
	WriteString(string) (int, error)

	// Written returns true if the response body was already written.
	Written() bool

	// WriteHeaderNow forces to write the http header (status code + headers).
	WriteHeaderNow()

	// Pusher get the http.Pusher for server push
	Pusher() http.Pusher
}
