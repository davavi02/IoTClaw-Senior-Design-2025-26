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
		fmt.Println("Error with token request: %v", err)
		return nil
	}

	return data
}
