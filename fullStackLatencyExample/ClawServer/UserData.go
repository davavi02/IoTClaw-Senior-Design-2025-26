package main

import (
	"context"
	"database/sql"
)

type UserData struct {
	DatabaseUID int64
	GoogleID    string
	Email       string `json:"email"`
	Name        string `json:"name"`
	ProfilePic  string `json:"profilePic"`
	NumberToken int64  `json:"tokens"`
	Jwt         string `json:"jwt,omitempty"`
}

func GetUserDataFromDatabase(ctx context.Context, trx *sql.Tx, user *GoogleUser) (*UserData, error) {
	row := trx.QueryRowContext(ctx, `SELECT UID, Email, Name, Pic, Coins FROM GoogleUser 
		JOIN CoinTotals ON GoogleUser.UID = CoinTotal.UID WHERE GID = ?`, user.GoogleID)

	userData := &UserData{GoogleID: user.GoogleID}

	err := row.Scan(&userData.DatabaseUID, &userData.Email, &userData.Name, &userData.ProfilePic, &userData.NumberToken)
	//Theres two case we want to handle. Doesn't exist meaning we need to make on or a actuall error.
	if err != nil {
		if err == sql.ErrNoRows {
			//Didn't exist.
			return nil, nil
		}
		//Actual error.
		return nil, err
	}

	return userData, nil
}
