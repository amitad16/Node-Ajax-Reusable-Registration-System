# Node-Ajax-Reusable-Registration-System
A reusable login and registration system using NodeJs + Express + MongoDB + AJAX. All the features which are expected from a registration system are implemented, with both front-end and back-end validations.

## Usage
Goto `server > config`
Create a file `config.json`

#### Add the below code to above path
    {
      "development": {
        "PORT": 3000,  // Port
        "MONGODB_URI": "mongodb://<dbuser>:<dbpassword><host>:<port>/<databasename>",  // mongodb://localhost:27017/databasename
        "JWT_SECRET": "",  // Random string of any length
        "EMAIL_ID": "",  // Your email id
        "EMAIL_PASSWORD": ""  // Your password
      }
    }

## Run Program
Go to the directory path inside your terminal and run 
- `npm install`
- `npm start`
