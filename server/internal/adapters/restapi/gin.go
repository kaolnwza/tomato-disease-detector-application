package rapi

import (
	"context"
	"fmt"
	"net/http"
	port "tomato-api/internal/ports"
	log "tomato-api/lib/logs"
	"tomato-api/lib/pkg"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type GinContext struct {
	*gin.Context
}

func NewGinContext(c *gin.Context) *GinContext {
	return &GinContext{c}
}

type GinRouter struct {
	*gin.Engine
}

type GinRouterGroup struct {
	*gin.RouterGroup
}

func NewGinRouter() *GinRouter {
	r := gin.Default()

	corsConfig := cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8000"},
		AllowMethods:     []string{"GET, POST, PUT, DELETE"},
		AllowHeaders:     []string{"Origin, Content-Type, Accept, Authorization"},
		AllowCredentials: true,
	})

	r.Use(corsConfig)

	return &GinRouter{r}
}

func NewGinHandler(handler func(port.Context)) gin.HandlerFunc {
	return func(c *gin.Context) {
		handler(NewGinContext(c))
	}
}

func NewGinRouterGroup(handler func(port.Context)) *GinRouterGroup {
	return &GinRouterGroup{}
}

func NewGinMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token, err := pkg.TokenValid(c)
		if err != nil {
			log.Error(fmt.Errorf("middleware valid token err: %s", err.Error()))
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}

		claims, err := pkg.ExtractToken(token)
		if err != nil {
			log.Error(fmt.Errorf("middleware extract token err: %s", err.Error()))
			c.JSON(http.StatusInternalServerError, err.Error())
			c.Abort()
			return
		}

		ctxUserUUID, err := uuid.Parse(fmt.Sprintf("%s", claims["user_uuid"]))
		if err != nil {
			log.Error(fmt.Errorf("middleware parse uuid err: %s", err.Error()))
			c.JSON(http.StatusBadRequest, err.Error())
			c.Abort()
			return
		}

		ctxKey := "access_user_uuid"
		ctx := context.WithValue(c.Request.Context(), ctxKey, ctxUserUUID)
		c.Request = c.Request.WithContext(ctx)

		c.Next()

	}
}

// gin method
func (r *GinRouter) POST(path string, handler func(port.Context)) {
	r.Engine.POST(path, NewGinHandler(handler))
}

func (r *GinRouter) GET(path string, handler func(port.Context)) {
	r.Engine.GET(path, NewGinHandler(handler))
}

func (r *GinRouter) PUT(path string, handler func(port.Context)) {
	r.Engine.PUT(path, NewGinHandler(handler))
}

func (r *GinRouter) PATCH(path string, handler func(port.Context)) {
	r.Engine.PATCH(path, NewGinHandler(handler))
}

func (r *GinRouter) DELETE(path string, handler func(port.Context)) {
	r.Engine.DELETE(path, NewGinHandler(handler))
}

func (r *GinRouter) GROUP(path string, handler ...gin.HandlerFunc) *GinRouterGroup {
	return &GinRouterGroup{r.Engine.Group(path, handler...)}
}

// group of group
func (r *GinRouterGroup) GROUP(path string, handler ...gin.HandlerFunc) *GinRouterGroup {
	return &GinRouterGroup{r.Group(path, handler...)}
}

func (r *GinRouterGroup) POST(path string, handler func(port.Context)) {
	r.RouterGroup.POST(path, NewGinHandler(handler))
}

func (r *GinRouterGroup) GET(path string, handler func(port.Context)) {
	r.RouterGroup.GET(path, NewGinHandler(handler))
}

func (r *GinRouterGroup) PUT(path string, handler func(port.Context)) {
	r.RouterGroup.PUT(path, NewGinHandler(handler))
}

func (r *GinRouterGroup) PATCH(path string, handler func(port.Context)) {
	r.RouterGroup.PATCH(path, NewGinHandler(handler))
}

func (r *GinRouterGroup) DELETE(path string, handler func(port.Context)) {
	r.RouterGroup.DELETE(path, NewGinHandler(handler))
}

// func (r *GinRouter) GROUP(path string, handler func(*gin.Context)) *gin.RouterGroup {
// 	return r.Engine.Group(path, NewGinMiddleware())
// }

//gin context
func (c *GinContext) Bind(v interface{}) error {
	return c.Context.ShouldBindJSON(v)
}

func (c *GinContext) JSON(statuscode int, v interface{}) {
	c.Context.JSON(statuscode, v)
}

func (c *GinContext) Request() *http.Request {
	return c.Context.Request
}

func (c *GinContext) Writer() port.ResponseWriter {
	return c.Context.Writer
}

func (c *GinContext) Abort() {
	c.Context.Abort()
}

func (c *GinContext) Ctx() context.Context {
	return c.Context.Request.Context()
}

func (c *GinContext) AccessUserUUID() uuid.UUID {
	userUUID, ok := c.Context.Request.Context().Value("access_user_uuid").(uuid.UUID)
	if !ok {
		c.Status(http.StatusInternalServerError)
		c.Abort()
		return uuid.Nil
	}

	return userUUID
}

func (c *GinContext) FormValue(key string) string {
	return c.Context.Request.FormValue(key)
}

func (c *GinContext) Param(key string) string {
	return c.Context.Params.ByName(key)
}
