package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

type ShopProducts struct {
	UniqueId  int64   `json:"uid"`
	NumTokens int64   `json:"tokens"`
	Price     float64 `json:"price"`
}

func GetShopProducts(w http.ResponseWriter, r *http.Request, db *sql.DB) error {
	rows, err := db.QueryContext(r.Context(), "SELECT UID, NumTokens, Price FROM TokenShop")

	if err != nil {
		return nil
	}
	defer rows.Close()

	productList := make([]*ShopProducts, 0)
	w.Header().Set("Content-Type", "application/json")

	for rows.Next() {
		product := &ShopProducts{}
		err = rows.Scan(&product.UniqueId, &product.NumTokens, &product.Price)

		if err != nil {
			fmt.Printf("Error scanning products from DB: %v\n", err)
			http.Error(w, "Error with DB.", http.StatusInternalServerError)

			return err
		}

		productList = append(productList, product)
	}

	formatedJson := make(map[string][]*ShopProducts)
	formatedJson["products"] = productList

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	err = json.NewEncoder(w).Encode(formatedJson)
	if err != nil {
		fmt.Printf("Error json formating products: %v\n", err)
		http.Error(w, "Error formating json.", http.StatusInternalServerError)
		return err
	}

	return nil
}
