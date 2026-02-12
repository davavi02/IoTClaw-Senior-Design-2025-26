package main

import (
	"context"
	"database/sql"
)

type UserData struct {
	DatabaseUID int64  `json:"-"`
	GoogleID    string `json:"-"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	ProfilePic  string `json:"profilePic"`
	NumberToken int64  `json:"tokens"`
	Jwt         string `json:"jwt,omitempty"`
}

func GetUserDataFromDatabaseByGID(ctx context.Context, trx *sql.Tx, googleID string) (*UserData, error) {
	row := trx.QueryRowContext(ctx, `SELECT GoogleUser.UID, Email, Name, Pic, Coins FROM GoogleUser 
		JOIN CoinTotals ON GoogleUser.UID = CoinTotals.UID WHERE GID = ?`, googleID)

	userData := &UserData{GoogleID: googleID}

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

func GetUserDataFromDatabaseByUID(ctx context.Context, trx *sql.Tx, uid int64) (*UserData, error) {
	row := trx.QueryRowContext(ctx, `SELECT GoogleUser.GID, Email, Name, Pic, Coins FROM GoogleUser 
		JOIN CoinTotals ON GoogleUser.UID = CoinTotals.UID WHERE GoogleUser.UID = ?`, uid)

	userData := &UserData{DatabaseUID: uid}

	err := row.Scan(&userData.GoogleID, &userData.Email, &userData.Name, &userData.ProfilePic, &userData.NumberToken)
	//Theres two case we want to handle. Doesn't exist or a actuall error.
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

func InsertNewUserInDatabase(ctx context.Context, trx *sql.Tx, user *GoogleUser) (*UserData, error) {
	res, err := trx.ExecContext(ctx, `INSERT INTO GoogleUser (GID, Email, Name, Pic) 
		VALUES (?, ?, ?, ?)`, &user.GoogleID, &user.Email, &user.Name, &user.ProfilePic)
	if err != nil {
		return nil, err
	}

	//Get uid of new record so i can attach to the other ones.
	uid, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	//Time to make records in address, and coin totals.
	res, err = trx.ExecContext(ctx, `INSERT INTO CoinTotals (UID, Coins) VALUES 
		(?, ?)`, &uid, 0)
	if err != nil {
		return nil, err
	}

	//Lastly address this probably needs to be thought out more...
	res, err = trx.ExecContext(ctx, `INSERT INTO UserAddress (UID, Name, Street, City, Zipcode, State)
		VALUES (?, ?, ?, ?, ?, ?)`, &uid, &user.Name, "", "", "", "")
	if err != nil {
		return nil, err
	}

	return &UserData{DatabaseUID: uid, GoogleID: user.GoogleID, Name: user.Name,
		ProfilePic: user.ProfilePic, NumberToken: 0}, nil
}
