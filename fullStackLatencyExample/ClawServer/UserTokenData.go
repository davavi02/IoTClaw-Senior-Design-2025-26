package main

import (
	"context"
	"database/sql"
	"fmt"
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
