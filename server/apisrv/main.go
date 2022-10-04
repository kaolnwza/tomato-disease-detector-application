package main

import (
	"fmt"
	"tomato-api/apisrv/controller"
)

func main() {

	controller.Controller("localhost:8888")

	fmt.Println("Hello World!!")
}
