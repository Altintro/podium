# Node API - Podium
#### Deployed: [node.winatpodium.com](https://node.winatpodium.com)
## Instalation

1. Download or clone the project
2. Open terminal and go to project's folder
3. Install dependencies 

	```
	npm install
	```
	
4. Start the server
	
	```
	npm start
	```
5. Initialize Database: Open a different terminal tab (make sure MongoDB is running before running the command)

 	```
 	npm run initDB 
 	```
 	

## Authentication

This server needs authentication in every request , in order to make requests you will need to be register as an *User* and have an **access token**, to get a token, follow the next steps:
	
* **Registration**: do a *post* request to */apiv1/auth/register*, the post must have a body with the registration fields: name, email, password:
	
		{ 
		name:  'name'
		username: 'username,
		pass:  'password',
		email: 'useremail'
		}
		  
		
	The response for the request will be an *access token* that should be use in 	**every request as a header** (x-access-token) in order to get a response 	from the server. Copy the token and save it for further requests.
		
		
* **Login**: If your token expires after having registered, you may login into the server. Do a *post* request to /apiv1/auth/login. the post must have a body with the login fields: email, password:
	
		{
		email: 'useremail',
		pass: 'password'
		}

	The response for the request will be an *access token* that should be use in **every request as a header** (x-access-token) in order to get a response from the server.
	
* **/me**: In order to know if you are logged into the server, you can do a *get* request to /me with your *access token** as a header of the request. The response will be your user information.
	

## Usage

Once you've registered and have an *access-token* you will be able to get responses with documents from the DataBase, by adding a header with key as **x-access-token** and value as your token.

* **Tournaments**:

	 In order to recieve the tournaments in the database make a *get* request to */apiv1/tournaments*. Also, tournaments can be filtered in the query of the request:

	* By name:  */apiv1/tournaments?name='some_name'* 
	* By sport:  */apiv1/tournaments?sport=tennis*
	* By type: */apiv1/tournaments?type=league*
	* Set a limit: */apiv1/tournaments?limit=2*
	* Skip certain ads: */apiv1/tournaments?skip=2&skip=6*
	* Recieve only chosen fields of the ads: */apiv1/tournaments?fields=name&fields=sport*
	* Sort the ads by property: */apiv1/tournaments?sort=sport*
	
* **Users**: In order to recieve the users registered in the database make a *get* request to */apiv1/users*. Also, ads can be filtered in the query of the request:
	* By name:  */apiv1/users?name='some_name'* 
	* By username:  */apiv1/users?username='some_user_name'*
	* Set a limit: */apiv1/users?limit=2*
	* Skip certain ads: */apiv1/users?skip=2&skip=6*
	* Recieve only chosen fields of the ads: */apiv1/users?fields=name&fields=username*
	* Sort the ads by property: */apiv1/users?sort=name*
