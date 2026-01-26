package main

import (
	"context"
	"database/sql"
)

type GameData struct {
	UniqueId    int64  `json:"uniqueId"`
	Name        string `json:"name"`
	PassHash    string `json:"password,omitempty"`
	Description string `json:"description"`
	CoinCost    int64  `json:"cost"`
}

func HandleGameDataLogin(ctx context.Context, tx *sql.Tx, data *GameData) error {
	stmt, err := tx.PrepareContext(ctx, "SELECT UID, Description, CoinCost FROM Machines WHERE Name = ? AND PassHash = ?")
	if err != nil {
		return err
	}

	err = stmt.QueryRowContext(ctx, &data.Name, &data.PassHash).Scan(&data.UniqueId, &data.Description, &data.CoinCost)
	if err != nil {
		return err
	}

	return nil
}
