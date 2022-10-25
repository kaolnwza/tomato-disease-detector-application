package main

import (
	"fmt"
	"tomato-api/apisrv/controller"
)

func main() {

	// controller.Controller("139.59.120.159:8888")
	controller.Controller("localhost:8765")

	fmt.Println("Hello World!!")
}
