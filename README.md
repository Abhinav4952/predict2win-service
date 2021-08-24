## **Predict2Win Application:-** 

 

Predict2Win provides  Web Application to allow users to predict to questions which allow users to participate in a collaborative platform which can be like a social gaming .It mainly contain 3 types of users:- 

- Admin:- He can control the state of league admin and list all the active leagues and view league dashboards. Can approve or reject leagues. 

- League Admin: He can add a new league, View his own league dashboard, Minimum details of participated users 

- User: He can participate in leagues by paying amount from his wallet for paid leagues and free leagues he can join directly and view his own participated events. 

Web Service API will be protected in both authentication and authorization using JWT token and Email service will also be integrated for sending Emails with the help of Send Grid SMTP Service. 

Schema validation using JOI 

---
# Features:-

## SSO:-
Application has Single Sign on with google account using React google login library

## Mailing:-
Application has functionality to send EMAIL's with the help of node mailer library and Send Grid mail service

## API Documentation:-
API Documentation is created with the help of swagger and accessible at <URL>/api/v1/api-docs

## Two way communication
Application will use a Socket communication for two way communication using socket.io

---


For initial data it can be seeded using code present in separate branch [feature/seed-data](https://github.com/Abhinav4952/predict2win-service/tree/feature/seed-data)

Steps for seeding data:-

1. Checkout to branch [feature/seed-data](https://github.com/Abhinav4952/predict2win-service/tree/feature/seed-data)

1. switch to utils/data-seeding

1. run node index.js

 

**Database**:- MongoDB Cloud  

 

Website is available on https://enigmatic-temple-25922.herokuapp.com/ 
