# Wallet app API(BACK-END)

### INTRO

This is an API created using Node.js, Express and PostGreSQL.
The main goal is to create an application that controls finances.

### Requeriments

-Node.js
-Docker

### Steps to run the project

1.Clone the project

```
Git Clone https://github.com/DevNicolasFerro/WalletAppBackEnd

```

2. Navigate to project folder and Install dependences

```
cd WalletAppBackEnd
npm install
```

3. Create an PostGreSQL instance in docker

docker run --name postgres-finances -e POSTGRES_PASSWORD=docker -e POSTGRES_USER=docker -p 5432:5432 -d -t postgres

4. Create a .env file following the example
   DB_USER=docker
   DB_PASSWORD=docker
   DB_NAME=finances
   DB_HOST=localhost
   DB_PORT=5432

5. Run config script to create database and tables:

```
npm run config:init
observation: if don't stop press CTRL+C
```

6. run the project in dev version:

```
npm run start:dev
```

7. run the project in final version
   npm run start

8. documentation

use insomnia to import the file below
https://github.com/DevNicolasFerro/WalletAppBackEnd/blob/main/Insomnia.json
