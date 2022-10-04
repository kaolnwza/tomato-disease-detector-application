package main

import (
	"fmt"
	"tomato-api/apisrv/controller"
)

func main() {

	controller.Controller("8000")

	fmt.Println("Hello World!!")
}
