package database

import (
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func init() {
	DatabaseConnecting()
}

func DatabaseConnecting() *sqlx.DB {
	db, err := sqlx.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Successfully connected!")
	return db
}
