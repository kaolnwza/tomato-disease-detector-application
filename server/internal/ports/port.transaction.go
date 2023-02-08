package port

import "context"

type Transactor interface {
	Get(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	GetOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	Insert(ctx context.Context, query string, args ...interface{}) error
	InsertWithReturning(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	InsertWithReturningOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error

	WithinTransaction(ctx context.Context, tx func(ctx context.Context) error) error
}
