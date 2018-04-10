# Node API - Podium
#### Deployed: [node.winatpodium.com](https://node.winatpodium.com)
## Instalation

1. Download or clone the project
2. Open terminal and go to project's folder
3. Install dependencies 

	```
	npm install
	```
4. Create **config.js** file, that exports the app secret and db authentication credentials. (If you are going to run this app in local, use your own db credentials -> *connectMongoose.js file*

	```
	'use_strict'
	
	module.exports {
		'host':'base_url'
		'secret': 'appsecret',
		'db': 'dbname',
		'dbuser': 'dbuser',
		'dbpass': 'dbpassword'
		'google_client_id': 'google_client_id',
		'smtpUserName': 'SESUSERNAME',
		'smtpPass': 'SESPASSWORD'
	}
	```
	
4. Initialize Database: Open a different terminal tab (make sure MongoDB is running before running the command:
	
	```
 	npm run initDB 
 	```
 
	
5. Start the server
	
	```
	npm start or nodemon
	```

 	
 	

## Authentication

This server needs authentication for most of requests , in order to make requests you will need to be register as an *User* and have an **access token**.

**IMPORTANT**: The response for a successfull register/login request will be an *access token* that should be use to authenticate in	**most of the requests as a header** (x-access-token) in order to get a response from the server. Copy the token and save it for further requests.

### Email 
---

* **Email Connect**: Post request to */apiv1/users/emailConnect?email='userEmail'*. Verifies weather an account exists for the email or not. if it does it returns: (notice if the account had logged in before with another method(google or facebobok) it will login anyway via email.)

	```
	{ auth: true } // status 200, send a magic link!
	```
	
	If it doesn't exist, it returns :

	```
	{ auth: false } // status 202 , lead user to registration fields (name 	and alias)
	```

* **Email Register**: Post request to */apiv1/users/emailRegister*: Registers user with the information from the body of the request:

	```
	{
	name: name,
	alias: alias,
	email: email
	}
	```
	Sends magic link to the user, if the magic link has been sent 	successfully, the request returns:

	```
	{ auth: true }
	```

### Google
---
* **Google Connect**: Post request to */apiv1/users/googleConnect?googleToken='user_token_google'*. If user exists and is merged with google, it logs in, if its not merge with google it merges the user with google and logs in anyway. both return:
	
	```
	{ auth: true, token: token } // status 200, user sign-in successfully
	```
	
	If user does not exist:

	```
	{ auth : true, token: token } // status 201 , user signed-up successfully
	```
	
### Facebobok // TODO
---
### Login Gateway // Testing only, will be deprecated
---

If your token expires after having registered, you may login into the server. Do a *post* request to /apiv1/users/login with the next body: 

```
{ email: 'email'}
```

The response for the request will be an *access token* that should be use in **requests that require authentication as a header** (x-access-token) in order to get a response from the server.
	

## Usage

Once you've registered and have an *access-token* you will be able to get responses with documents from the DataBase, by adding a header with key as **x-access-token** and value as your token.

### Games
---

* **Get Games**: In order to recieve the games in the database make a *get* request to */apiv1/games*. Also, games can be filtered in the query of the request:

	* By name:  */apiv1/games?name='some_name'* 
	* Set a limit: */apiv1/games?limit=2*
	* Sort the ads by property: */apiv1/games?sort=sport*

* **Get Game Detail**: Get request to */apiv1/games/detail/gameObjectId?participants=true* 

	(Adding participants=true or participants = false to the query, populates the 	property *participants* of the game being recieved or not, with the Team 	objects participanting on the game )

* **Post Game**: (auth required) Post request to */apiv1/games*. The post must have a body with the next format:
	
	```
	{
	name: 'name_of_game'
	sport: 'sport_of_game'
	}
	```
	
* **Subscribe to Game**: (auth required) Post request to */apiv1/games/signup/gameObjectid*.

* **Delete Game** : (auth required) Delete request to */apiv1/games/gameObjectid*

### Tournaments:
---

* **Get Tournaments**:

	 In order to recieve the tournaments in the database make a *get* request to */apiv1/tournaments*. Also, tournaments can be filtered in the query of the request:

	* By name:  */apiv1/tournaments?name='some_name'* 
	* By type: */apiv1/tournaments?type=league*
	* Set a limit: */apiv1/tournaments?limit=2*
	* Skip certain ads: */apiv1/tournaments?skip=2&skip=6*
	* Recieve only chosen fields of the ads: */apiv1/tournaments?fields=name&fields=sport*
	* Sort the ads by property: */apiv1/tournaments?sort=sport*

* **Get Tournament Detail**: Get request to */apiv1/tournaments/tournamentObjectId?participants=true* 

	(Adding participants=true or participants = false to the query, populates the 	property *participants* of the tournament being recieved or not, with the Team 	objects participanting on the tournament)

* **Post Tournament**: Post request to /apiv1/tournaments. The post must have a body with the next format:

	```
	{
	name: 'name',
	compType: 'compType',
	}
	
	```
* **Subscribe to tournament**: Post request to */apiv1/tournaments/signup/tournamentObjectid*. post must have a body with the next format
	
* **Delete Tournament** : Delete request to /apiv1/tournaments/tournamentObjectid
		
### Users:
---

* **Get Users**:

 	In order to recieve the users registered in the database make a *get* request to */	apiv1/users*. Also, ads can be filtered in the query of the request:
 	
 	* By name:  */apiv1/users?name='some_name'*
 	* By alias:  */apiv1/users?alias='some_alias'*
 	* Set a limit: */apiv1/users?limit=2*
 	* Skip certain ads: */apiv1/users?skip=2&skip=6*
 	* Recieve only chosen fields of the ads: */apiv1/users?fields=name&fields=alias*
 	* Sort the ads by property: */apiv1/users?sort=name*
 	
* **Get User Detail**: Get request to */apiv1/users/detail/userObjectId?games=true* 

	(Adding games=true or games=false to the query, populates the 	property *gamesPlaying* of the game being recieved or not, with the Game 	objects that the user is participating in)

* **Delete User**: (auth required) Delete request to /apiv1/users/userObjectid
