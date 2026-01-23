package main

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type DatabaseManager struct {
	db *sql.DB
}

func InitializeDatabase() (*DatabaseManager, error) {
	dbcon, err := sql.Open("mysql", "clawser:reallyhardpassword1!@tcp(34.174.114.55:20206)/clawser")
	if err != nil {
		fmt.Printf("Error initializing DB: %v\n", err)
		return nil, err
	}
	defer dbcon.Close()

	err = dbcon.Ping()
	if err != nil {
		fmt.Printf("Error pinging DB: %v\n", err)
		return nil, err
	}

	fmt.Println("Success connecting to the DB")
	dbmPtr := &DatabaseManager{db: dbcon}
	return dbmPtr, nil
}

func (dbMan *DatabaseManager) BeginTransaction(ctx context.Context) (*sql.Tx, error) {
	tx, err := dbMan.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	return tx, nil
}
