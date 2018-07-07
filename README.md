# Node-Ajax-Reusable-Registration-System
A reusable login and registration system using NodeJs + Express + MongoDB + AJAX. All the features which are expected from a registration system are implemented. With both front-end and back-end validations.

## Before Use
Goto `server > config`
Create a file `config.json`

#### Add the below code to above path
    {
      "development": {
        "PORT": 3000,  // Port
        "MONGODB_URI": "mongodb://<dbuser>:<dbpassword><host>:<port>/<databasename>",  // eg.(For localhost): mongodb://localhost:27017/databasename
        "JWT_SECRET": "",  // Random string of any length
        "EMAIL_ID": "",  // Your email id
        "EMAIL_PASSWORD": ""  // Your password
      }
    }
