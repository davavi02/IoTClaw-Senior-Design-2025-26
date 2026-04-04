package main

import (
	"context"
	"database/sql"
	"time"
)

// UserPrizeJSON matches the React Native Prize type fields.
type UserPrizeJSON struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	DateWon     string `json:"dateWon"`
	ImageURL    string `json:"imageUrl"`
	IsShipped   bool   `json:"isShipped"`
	IsDelivered bool   `json:"isDelivered"`
}

func GetUserPrizesForUID(ctx context.Context, db *sql.DB, uid int64) ([]UserPrizeJSON, error) {
	rows, err := db.QueryContext(ctx, `
		SELECT p.Name, p.Description, p.PicUrl, u.WonAt, u.IsShipped, u.IsDelivered
		FROM UserPrize u INNER JOIN Prize p on u.PID = p.PID WHERE UID = ? ORDER BY WonAt DESC`, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]UserPrizeJSON, 0)
	for rows.Next() {
		var (
			name        string
			description sql.NullString
			picURL      sql.NullString
			wonAt       time.Time
			shipped     int64
			delivered   int64
		)
		if err := rows.Scan(&name, &description, &picURL, &wonAt, &shipped, &delivered); err != nil {
			return nil, err
		}
		desc := ""
		if description.Valid {
			desc = description.String
		}
		img := ""
		if picURL.Valid {
			img = picURL.String
		}
		out = append(out, UserPrizeJSON{
			Name:        name,
			Description: desc,
			DateWon:     wonAt.UTC().Format(time.RFC3339),
			ImageURL:    img,
			IsShipped:   shipped != 0,
			IsDelivered: delivered != 0,
		})
	}
	return out, rows.Err()
}

func AwardPrize(prizeId int64, uid int64, server *Server) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	trx, err := server.dbMan.BeginTransaction(ctx)
	if err != nil || trx == nil {
		return err
	}
	defer trx.Rollback()

	_, err = trx.ExecContext(ctx, `INSERT INTO UserPrize (PID, UID) VALUES (?,?)`, prizeId, uid)

	if err != nil {
		return err
	}

	err = trx.Commit()
	if err != nil {
		return err
	}

	return nil
}
