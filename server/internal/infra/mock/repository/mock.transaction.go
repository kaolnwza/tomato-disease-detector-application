package mocks

import (
	"context"

	"github.com/stretchr/testify/mock"
)

type txMock struct {
	mock.Mock
}

func NewTransactionMock() *txMock {
	return &txMock{}
}

func (m *txMock) Get(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) GetOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) Insert(ctx context.Context, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) Update(ctx context.Context, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) InsertWithReturning(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) InsertWithReturningOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) Delete(ctx context.Context, query string, args ...interface{}) error {
	panic("unimplement")
}
func (m *txMock) WithinTransaction(ctx context.Context, tx func(ctx context.Context) error) error {
	panic("unimplement")
}
