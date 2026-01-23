package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type DatabaseManager struct {
	db *sql.DB
}

func InitializeDatabase() (*DatabaseManager, error) {
	dbcon, err := sql.Open("mysql", "clawser:reallyhardpassword1@tcp(34.174.114.55:20206)/clawser")
	if err != nil {
		fmt.Println("Error initializing DB: %v", err)
		return nil, err
	}
	defer dbcon.Close()

	err = dbcon.Ping()
	if err != nil {
		fmt.Println("Error pinging DB: %v", err)
		return nil, err
	}

	dbmPtr := &DatabaseManager{db: dbcon}
	return dbmPtr, nil
}
