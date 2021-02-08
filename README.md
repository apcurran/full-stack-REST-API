# Billow Home Realty App (Server Side)

## Features:

* Express utilized as Node JS framework

* MongoDB for database

* Custom REST API with routes for GET, POST, PATCH, and DELETE (Admin ui on client code for interaction with the API)

* Admin account creation in db, as well as creation of user accounts

* Authorization login implemented with JWT

* Multer package used to upload images during the creation of a new home on the client side

* Pagination used to display a limited number of API results per page on client side

* Express-Validator used for validation on server side

* Populate DB mini-program written to pre-populate the db with fake data, using the Faker npm package

* Implemented Redis as a caching layer for /homes/:homeId route, as a proof of concept for this feature to be added in a production site