package main

import (
	"context"
	"fmt"
	"math/rand/v2"
	"strconv"

	"google.golang.org/api/idtoken"
)

const googleClientID = "973669949194-htjphkms2t4jmmtlrldmi7pcmhnsalmu.apps.googleusercontent.com"
const androidClientID = "973669949194-claasjhgvpu9v9ops7iesps06t57f203.apps.googleusercontent.com"

type GoogleUser struct {
	DatabaseUID int64
	GoogleID    string `json:"-"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	ProfilePic  string `json:"profilePic"`
}

func VerifyAndGetGoogleUser(tokenString string, ctx context.Context) *GoogleUser {
	tokenData, err := idtoken.Validate(ctx, tokenString, googleClientID)
	if err != nil {
		//Check android.
		tokenData, err = idtoken.Validate(ctx, tokenString, androidClientID)
		if err != nil {
			fmt.Printf("Error validating Google ID token: %v\n", err)
			return nil
		}

	}
	user := &GoogleUser{}

	//Check everything cause nothing is apparently guarenteed..
	//Google id is but still checking.. cause better safe than o crap
	gID, ok := tokenData.Claims["sub"].(string)
	if !ok || gID == "" {
		fmt.Println("Strange error during google sign in. Google ID is null.")
		return nil
	}
	user.GoogleID = gID

	//email
	email, ok := tokenData.Claims["email"].(string)
	if ok && email != "" {
		user.Email = email
	} else {
		user.Email = "Not Provided"
	}

	//name
	name, ok := tokenData.Claims["name"].(string)
	if ok && name != "" {
		user.Name = name
	} else {
		//Thought it would be cute to make a random number here..
		user.Name = "Default Name #" + strconv.FormatInt((rand.Int64N(100000)), 10)
	}

	//profile pic
	pic, ok := tokenData.Claims["picture"].(string)
	if ok && pic != "" {
		user.ProfilePic = pic
	} else {
		//Cause hell yeah.
		user.ProfilePic = "https://images.albertsons-media.com/is/image/ABS/184450056?$ng-ecom-pdp-desktop$&defaultImage=Not_Available"
	}

	return user
}
