package repository

import (
	"fmt"

	uuid "github.com/satori/go.uuid"
)

type Kuy struct {
	UUID uuid.UUID `json:"uuid"`
	Name string    `json:"name"`
}

func TestFuck555() error {

	var x []Kuy

	s := `select * from testlol555`

	err := db.Select(&x, s)
	fmt.Println("here", x)
	return err
}

func TestFuckLOL() {

	// tx := db.MustBegin()
	// dummy := false
	s := `insert into testlol555 (name) values('wtf')`
	lel, err := db.Exec(s)
	if err != nil {
		fmt.Println("err", err)
		db.MustBegin().Rollback()
	}
	// comm := tx.Commit()
	fmt.Println("res", lel)
	// fmt.Println("com", comm)
}
