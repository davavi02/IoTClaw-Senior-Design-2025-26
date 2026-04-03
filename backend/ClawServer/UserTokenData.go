package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

type UserTokenData struct {
	UniqueId  int64 `json:"-"`
	NumTokens int64 `json:"tokens"`
}

func GetUserTokenData(ctx context.Context, db *sql.DB, uid int64) *UserTokenData {
	data := &UserTokenData{UniqueId: uid}

	err := db.QueryRowContext(ctx, "SELECT Coins FROM CoinTotals WHERE UID = ?", uid).Scan(&data.NumTokens)
	if err != nil {
		fmt.Printf("Error with token request: %v\n", err)
		return nil
	}

	return data
}

func GetUserTokenDataTrx(ctx context.Context, trx *sql.Tx, uid int64) *UserTokenData {
	data := &UserTokenData{UniqueId: uid}

	err := trx.QueryRowContext(ctx, "SELECT Coins FROM CoinTotals WHERE UID = ?", uid).Scan(&data.NumTokens)
	if err != nil {
		fmt.Printf("Error with token request: %v\n", err)
		return nil
	}

	return data
}

func PayTokens(tokenAmt int64, uid int64, server *Server) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	trx, err := server.dbMan.BeginTransaction(ctx)
	if err != nil || trx == nil {
		return err
	}
	defer trx.Rollback()

	res, err := trx.ExecContext(ctx, `UPDATE CoinTotals 
        SET Coins = Coins - ? WHERE UID = ? AND Coins >= ?`, tokenAmt, uid, tokenAmt)

	if err != nil {
		return err
	}

	num, err := res.RowsAffected()
	if err != nil || num == 0 {
		return errors.New("Insufficient coins or database does not support.")
	}
	err = trx.Commit()
	if err != nil {
		return err
	}

	return nil
}
