# Node-Ajax-Reusable-Registration-System
A [reusable login and registration system](https://thawing-sierra-18075.herokuapp.com/) using NodeJs + Express + MongoDB + AJAX. All the features which are expected from a registration system are implemented, with both front-end and back-end validations.

## See the working here:
[https://thawing-sierra-18075.herokuapp.com/](https://thawing-sierra-18075.herokuapp.com/)

## Usage
Goto `server > config`
Create a file `config.json`

#### Add the below code to above path
    {
      "development": {
        "PORT": <PORT>,
        "MONGODB_URI": "<mongodb://localhost:27017/yourdatabasename>",
        "JWT_SECRET": "<Random string of any length>",
        "EMAIL_ID": "<Your email id>",
        "EMAIL_PASSWORD": "<Your password>",
	    "DOMAIN_NAME": "<eg: http://localhost:3000>"
      }
    }

## Run Program
Go to the directory path inside your terminal and run
- `npm install`
- `npm start`
