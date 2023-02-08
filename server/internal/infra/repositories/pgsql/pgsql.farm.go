package pgsql

import port "tomato-api/internal/ports"

type farmRepo struct {
	tx port.Transactor
}

func NewFarmRepository(tx port.Transactor) port.FarmRepository {
	return &farmRepo{tx: tx}
}
