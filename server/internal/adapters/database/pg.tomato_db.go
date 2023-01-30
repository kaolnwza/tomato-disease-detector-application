package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func PostgresTomato() *sqlx.DB {
	conn, err := sqlx.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Successfully | Postgres Tomato Database | connected!")

	return conn
}

type txKey struct{}

// injectTx injects transaction to context
func injectTx(ctx context.Context, tx *sqlx.Tx) context.Context {
	return context.WithValue(ctx, txKey{}, tx)
}

// extractTx extracts transaction from context
func extractTx(ctx context.Context) *sqlx.Tx {
	if tx, ok := ctx.Value(txKey{}).(*sqlx.Tx); ok {
		return tx
	}
	return nil
}

// func (db *postgresRepo) Select(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
// 	tx := extractTx(ctx)
// 	if tx != nil {
// 		return tx.GetContext(ctx, dest, query, args...)
// 	}

// 	return db.conn.GetContext(ctx, dest, query, args...)
// }
func (db *postgresRepo) Get(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	tx := extractTx(ctx)
	if tx != nil {
		return tx.SelectContext(ctx, dest, query, args...)
	}

	return db.conn.SelectContext(ctx, dest, query, args...)
}

func (db *postgresRepo) GetOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	tx := extractTx(ctx)
	if tx != nil {
		return tx.GetContext(ctx, dest, query, args...)
	}

	return db.conn.GetContext(ctx, dest, query, args...)
}

func (db *postgresRepo) Insert(ctx context.Context, query string, args ...interface{}) error {
	tx := extractTx(ctx)
	if tx != nil {
		_, err := tx.ExecContext(ctx, query, args...)
		return err
	}

	_, err := db.conn.ExecContext(ctx, query, args...)
	return err
}

func (db *postgresRepo) InsertWithReturning(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	tx := extractTx(ctx)
	if tx != nil {
		return tx.SelectContext(ctx, dest, query, args...)
	}

	return db.conn.SelectContext(ctx, dest, query, args...)
}

func (db *postgresRepo) InsertWithReturningOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error {
	tx := extractTx(ctx)
	if tx != nil {
		return tx.GetContext(ctx, dest, query, args...)
	}

	return db.conn.GetContext(ctx, dest, query, args...)
}

type postgresRepo struct {
	conn *sqlx.DB
}

func NewPostgresRepo(db *sqlx.DB) Transactor {
	return &postgresRepo{conn: db}
}

type Transactor interface {
	// Select(context.Context, interface{}, string, ...interface{}) error
	// Select(q sqlx.Queryer, dest interface{}, query string, args ...interface{}) error
	Get(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	GetOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	Insert(ctx context.Context, query string, args ...interface{}) error
	InsertWithReturning(ctx context.Context, dest interface{}, query string, args ...interface{}) error
	InsertWithReturningOne(ctx context.Context, dest interface{}, query string, args ...interface{}) error

	WithinTransaction(ctx context.Context, tx func(ctx context.Context) error) error
}

func (db *postgresRepo) WithinTransaction(ctx context.Context, tFunc func(ctx context.Context) error) error {
	// begin transaction

	tx, err := db.conn.Beginx()
	if err != nil {
		return fmt.Errorf("begin transaction: %w", err)
	}
	fmt.Println("-------Postgres Transaction: Begin---------")

	// defer func() {
	// 	// finalize transaction on panic, etc.
	// 	if errTx := tx.Close(); errTx != nil {
	// 		log.Printf("close transaction: %v", errTx)
	// 	}
	// }()

	// run callback
	err = tFunc(injectTx(ctx, tx))
	if err != nil {
		// if error, rollback
		if errRollback := tx.Rollback(); errRollback != nil {
			log.Printf("rollback transaction: %v", errRollback)
		}

		fmt.Println("-------Postgres Transaction: Rollback-------")
		return err
	}
	// if no error, commit
	if errCommit := tx.Commit(); errCommit != nil {
		log.Printf("commit transaction: %v", errCommit)
	}

	fmt.Println("-------Postgres Transaction: Committed------")
	return nil
}

// type Transaction interface {
// 	// Exec(query string, args ...interface{}) (sql.Result, error)
// 	// Prepare(query string) (*sql.Stmt, error)
// 	// Query(query string, args ...interface{}) (*sql.Rows, error)
// 	// QueryRow(query string, args ...interface{}) *sql.Row
// 	Get(q sqlx.Queryer, dest interface{}, query string, args ...interface{}) error
// 	Insert(q sqlx.Execer, query string, args ...interface{}) (sql.Result, error)
// }

// A Txfn is a function that will be called with an initialized `Transaction` object
// that can be used for executing statements and queries against a database.
// type TxFn func(Transaction) error

// func WithTransaction(db *sqlx.DB, fn TxFn) error {
// 	tx, err := db.Beginx()
// 	if err != nil {
// 		return nil
// 	}

// 	defer func() {
// 		// if p := recover(); p != nil {
// 		// 	// a panic occurred, rollback and repanic
// 		// 	tx.Rollback()
// 		// 	panic(p)
// 		// } else
// 		if err != nil {
// 			// something went wrong, rollback
// 			tx.Rollback()
// 		} else {
// 			// all good, commit
// 			err = tx.Commit()
// 		}
// 	}()

// 	err = fn(tx)
// 	return err
// }

// type SqlDBTx struct {
// 	DB *sql.DB
// }

// // SqlConnTx is the concrete implementation of sqlGdbc by using *sql.Tx
// type SqlConnTx struct {
// 	DB *sql.Tx
// }

// type Transactioner interface {
// 	// Rollback a transaction
// 	Rollback() error
// 	// Commit a transaction
// 	Commit() error
// 	// TxEnd commits a transaction if no errors, otherwise rollback
// 	// txFunc is the operations wrapped in a transaction
// 	TxEnd(txFunc func() error) error
// 	// TxBegin gets *sql.DB from receiver and return a SqlGdbc, which has a *sql.Tx
// 	TxBegin() (SqlxRepository, error)
// }

// type SqlxRepository interface {
// 	Exec(query string, args ...interface{}) (sql.Result, error)
// 	Prepare(query string) (*sql.Stmt, error)
// 	Query(query string, args ...interface{}) (*sql.Rows, error)
// 	QueryRow(query string, args ...interface{}) *sql.Row
// 	Select()
// 	// If need transaction support, add this interface
// 	Transactioner
// }

// // func (sdt *SqlDBTx) TxBegin() (SqlxRepository, error) {
// func (sdt *SqlDBTx) TxBegin() (*SqlConnTx, error) {
// 	tx, err := sdt.DB.Begin()
// 	sct := SqlConnTx{tx}
// 	return &sct, err
// }

// func (sct *SqlConnTx) TxEnd(txFunc func() error) error {
// 	var err error
// 	tx := sct.DB

// 	defer func() {
// 		if p := recover(); p != nil {
// 			tx.Rollback()
// 			panic(p) // re-throw panic after Rollback
// 		} else if err != nil {
// 			tx.Rollback() // err is non-nil; don't change it
// 		} else {
// 			err = tx.Commit() // if Commit returns error update err with commit err
// 		}
// 	}()
// 	err = txFunc()
// 	return err
// }

// func (sct *SqlConnTx) Rollback() error {
// 	return sct.DB.Rollback()
// }

// func (sct *SqlConnTx) Commit() error {
// 	return sct.DB.Commit()
// }
