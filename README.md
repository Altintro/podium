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
		'secret': 'appsecret',
		'db': 'dbname',
		'dbuser': 'dbuser',
		'dbpass': 'dbpassword'
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

This server needs authentication in every request , in order to make requests you will need to be register as an *User* and have an **access token**, to get a token, follow the next steps:
	
* **Registration**: do a *post* request to */apiv1/users/register*, the post must have a body with the registration fields: name, alias, email, password:
	
		{ 
		name:  'name'
		alias: 'alias,
		pass:  'password',
		email: 'useremail'
		}
		  
		
	**IMPORTANT**: The response for the request will be an *access token* that should be use in 	**every request as a header** (x-access-token) in order to get a response 	from the server. Copy the token and save it for further requests.
		
		
* **Login**: If your token expires after having registered, you may login into the server. Do a *post* request to /apiv1/users/login. the post must have a body with the login fields: email, password:
	
		{
		email: 'email',
		pass: 'password'
		}

	The response for the request will be an *access token* that should be use in **every request as a header** (x-access-token) in order to get a response from the server.
	
* **/me**: In order to know if you are logged into the server, you can do a *get* request to /apiv1/users/me with your *access token** as a header of the request. The response will be your user information.
	

## Usage

Once you've registered and have an *access-token* you will be able to get responses with documents from the DataBase, by adding a header with key as **x-access-token** and value as your token.

### Games

* **Get Games**:

	 In order to recieve the games in the database make a *get* request to */apiv1/games*. Also, games can be filtered in the query of the request:

	* By name:  */apiv1/games?name='some_name'* 
	* By type: */apiv1/games?type=league*
	* Set a limit: */apiv1/games?limit=2*
	* Skip certain ads: */apiv1/games?skip=2&skip=6*
	* Recieve only chosen fields of the ads: */apiv1/games?fields=name&fields=sport*
	* Sort the ads by property: */apiv1/games?sort=sport*

* **Post Game**: Post request to */apiv1/games*. The post must have a body with the next format:
	
	```
	{
	name: 'gameName'
	}
	```

	
* **Subscribe to Game**: Post request to */apiv1/games/signup/gameObjectid*.

* **Delete Game** : Delete request to */apiv1/games/gameObjectid*

### Tournaments:

* **Get Tournaments**:

	 In order to recieve the tournaments in the database make a *get* request to */apiv1/tournaments*. Also, tournaments can be filtered in the query of the request:

	* By name:  */apiv1/tournaments?name='some_name'* 
	* By type: */apiv1/tournaments?type=league*
	* Set a limit: */apiv1/tournaments?limit=2*
	* Skip certain ads: */apiv1/tournaments?skip=2&skip=6*
	* Recieve only chosen fields of the ads: */apiv1/tournaments?fields=name&fields=sport*
	* Sort the ads by property: */apiv1/tournaments?sort=sport*

* **Post Tournament**: Post request to /apiv1/tournaments. The post must have a body with the next format:

	```
	{
	name: 'name',
	compType: 'sport',
	}
	
	```
* **Subscribe to tournament**: Post request to */apiv1/tournaments/signup/tournamentObjectid*. post must have a body with the next format
	
* **Delete Tournament** : Delete request to /apiv1/tournaments/tournamentObjectid
		
### Users:
* **Get Users**:

 	In order to recieve the users registered in the database make a *get* request to */	apiv1/users*. Also, ads can be filtered in the query of the request:
 	
 	* By name:  */apiv1/users?name='some_name'*
 	* By alias:  */apiv1/users?alias='some_alias'*
 	* Set a limit: */apiv1/users?limit=2*
 	* Skip certain ads: */apiv1/users?skip=2&skip=6*
 	* Recieve only chosen fields of the ads: */apiv1/users?fields=name&fields=alias*
 	* Sort the ads by property: */apiv1/users?sort=name*

* **Delete User**: Delete request to /apiv1/users/userObjectid
