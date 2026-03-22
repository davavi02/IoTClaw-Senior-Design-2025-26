package main

import (
	"context"
	"database/sql"
)

func InsertErrorReport(ctx context.Context, trx *sql.Tx, uid int64, subject, message string) error {
	_, err := trx.ExecContext(ctx,
		`INSERT INTO ErrorReport (UID, Subject, Message) VALUES (?, ?, ?)`,
		uid, subject, message)
	return err
}
