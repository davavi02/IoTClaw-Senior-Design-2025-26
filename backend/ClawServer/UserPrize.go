package main

import (
	"context"
	"database/sql"
	"strconv"
	"time"
)

// UserPrizeJSON matches the React Native Prize type fields.
type UserPrizeJSON struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	DateWon     string `json:"dateWon"`
	ImageURL    string `json:"imageUrl"`
	IsShipped   bool   `json:"isShipped"`
	IsDelivered bool   `json:"isDelivered"`
}

func GetUserPrizesForUID(ctx context.Context, db *sql.DB, uid int64) ([]UserPrizeJSON, error) {
	rows, err := db.QueryContext(ctx, `
		SELECT PID, Name, Description, PicUrl, WonAt, IsShipped, IsDelivered
		FROM UserPrize WHERE UID = ? ORDER BY WonAt DESC`, uid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := make([]UserPrizeJSON, 0)
	for rows.Next() {
		var (
			pid         int64
			name        string
			description sql.NullString
			picURL      sql.NullString
			wonAt       time.Time
			shipped     int64
			delivered   int64
		)
		if err := rows.Scan(&pid, &name, &description, &picURL, &wonAt, &shipped, &delivered); err != nil {
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
			ID:          strconv.FormatInt(pid, 10),
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
