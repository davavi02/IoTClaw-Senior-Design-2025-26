package main

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

// Hi, this is Phil saying I know that I shouldn't have this or google id hardcoded.
// But I'm writing the backend real quick and if it's that important we can change it.
var secretKey = []byte("Z3JlYXRseXZhc3Rhbnl3YXlmYXZvcml0ZWJyb2tlbWlzc2luZ2NhcmVmdWxseW5vZGQ=")

type JWTData struct {
	UserId     string `json:"userId"`
	IsAdmin    bool   `json:"isAdmin"`
	IsGame     bool   `json:"isGame"`
	UniqueId   string `json:"uniqueId"`
	Expiration int64  `json:"exp"`
	jwt.RegisteredClaims
}

func createToken(userID int64, isAdmin bool, isGame bool) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"userId":   userID,
			"isAdmin":  isAdmin,
			"isGame":   isGame,
			"uniqueId": uuid.New().String(),
			"exp":      time.Now().Add(time.Hour * 24).Unix(),
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		fmt.Printf("Error creating JWT: %v\n", err)
		return "", err
	}

	return tokenString, nil
}

func verifyToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return err
	}

	if !token.Valid {
		return fmt.Errorf("invalid token")
	}

	return nil
}

func getJwtData(tokenString string) *JWTData {
	data := &JWTData{}
	token, err := jwt.ParseWithClaims(tokenString, data, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil
	}

	if !token.Valid {
		fmt.Println("invalid token")
		return nil
	}

	return data
}
