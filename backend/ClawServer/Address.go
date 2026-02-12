package main

import (
	"context"
	"database/sql"
)

type AddressData struct {
	UniqueId int64  `json:"-"`
	Name     string `json:"name"`
	Street   string `json:"street"`
	City     string `json:"city"`
	Zipcode  string `json:"zipcode"`
	State    string `json:"state"`
}

func GetAddressData(ctx context.Context, trx *sql.Tx, uid int64) (*AddressData, error) {
	row := trx.QueryRowContext(ctx, `SELECT Name, Street, City, Zipcode, State FROM UserAddress 
		WHERE UID = ?`, uid)

	addyData := &AddressData{UniqueId: uid}

	err := row.Scan(&addyData.Name, &addyData.Street, &addyData.City, &addyData.Zipcode, &addyData.State)
	//Theres two case we want to handle. Doesn't exist meaning we need to make on or a actuall error.
	if err != nil {
		if err == sql.ErrNoRows {
			//Didn't exist.
			return nil, nil
		}
		//Actual error.
		return nil, err
	}

	return addyData, nil
}

// dont forget to chunk uid into the data & check its not a malicous cabinent
func UpdateAddressData(ctx context.Context, trx *sql.Tx, data *AddressData) error {
	stmt, err := trx.PrepareContext(ctx, `UPDATE UserAddress SET Name = ?, Street = ?, City = ?, Zipcode = ?, State = ? WHERE UID = ?`)
	if err != nil {
		return err
	}

	res, err := stmt.ExecContext(ctx, &data.Name, &data.Street, &data.City, &data.Zipcode, &data.State, &data.UniqueId)
	numAffect, _ := res.RowsAffected()
	if err != nil || numAffect > 1 {
		return sql.ErrNoRows //makes debugging suck but this is all i got lol
	}

	return nil
}
