package main

type GoogleUser struct {
	DatabaseUID int64
	GoogleID    string
	Email       string `json:"email"`
	Name        string `json:"name"`
	ProfilePic  string `json:"profilePic"`
}
