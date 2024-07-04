# E-commerce MERN Stack Project
# Back-end Development


✅ Project setup
   - create express server
   - setup export & import
   - nodemon and morgan package -> developer dependencies
   - How to secure API -> xss-clean, express-rate-limit
   - API testing with postman
   - Environment variable & .gitignore
   - create README.md file
   - MVC pattern in software architecture


`✅ Database setup`
   - connect to mongodb atlas database / local mongodb compass


✅ Users API
 - 🔖 User model and schema with validations for user

1. POST /api/users/process-register -> create the user account (D)
    - get multi-part form data from the request body using multer
    - input validation check -> presence, image size, user exist
    - password hashing with bcrypt
    - create a jwt for storing user data temporarily
    - for jwt secret key: require("crypto").randomBytes(64).toString('hex')
    - send email with nodemailer (SMTP gmail username, password)

2. POST /api/users/activate -> activate the user account (D)
    - get the jwt from request
    - check existing of jwt
    - verify the jwt & decode the data
    - create & save the new user

3. GET /api/users/profile -> get the user account (D)
    - get the id from request body
    - findById()
    - send response based on user found or not
    - handle the mongoose Cast error

4. DELETE /api/users/:id -> delete the user account (D)
    - get the id from request body
    - findById(id)
    - if found delete the image from the server folder
    - findByIdAndDelete(id)
    - clear the cookies
    - send response

5. PUT /api/users/:id -> update the user account (D)
    - get the data from request body and params
    - create filter, updates, options
    - check image exist -> image size -> change updates
    - findByIdAndUpdate(filter, updates, options)
    - if user was updated then send response

6. PUT /api/users/update-password/:id -> update the password
7. POST /api/users/forget-password -> forget the password
8. PUT /api/users/reset-password -> reset the password
9. PUT /api/users/ban/:id -> ban the user
10. PUT /api/users/unban/:id -> unban the user

11. GET - Admin - /api/users/all-users -> get all users including search & pagination (D)
    - get data from request body
    - search users using regex
    - include pagination
    - send response


✅ Auth API
1. POST /api/auth/login -> isLoggedOut -> user login (D)
    - middlewares: validateUserLogin, runValidation using express-validator, isLoggedOut
    - extract request body
    - check user existing
    - compare the password & return response
    - check user is banned & return response
    - create jwt token with an expiry time
    - create http only cookie with less time

2. POST /api/auth/logout -> isLoggedIn -> user logout (D)
    - clear the cookie
    - send the response

3. GET /api/auth/refresh-token -> get refresh token (D)
    - get old access token from cookie
    - verify old token
    - if verified - clear existing cookie, create refresh token (new token), cookie, return refresh token

4. GET /api/auth/protected -> protected route (D)


✅ Category API
 - 🔖 Create category schema and model
    - name, slug (how to use slugify npm)
    - slug
    - Create category validations
    - Create category routes and controller
    - Category CRUD Operations

1. POST /api/categories -> create category (D)
2. GET /api/categories ->  get all categories (D)
3. GET /api/categories/:slug -> get single category (D)
4. DELETE /api/categories/:slug -> delete category (D)
5. PUT /api/categories/:slug -> update category (D)


✅ Product API
 - 🔖 create product schema and model
    - ref Category model
    - create product validation
    - create product routes and controller

1. POST /api/products -> create product (D)
2. GET /api/products -> get all products including search & pagination (D)
3. GET /api/products/:slug -> get single product (D)
4. DELETE /api/products/:slug -> delete product (D)
5. PUT /api/products/:slug -> update product (D)


✅ Middleware
   - isLoggedIn
   - isLoggedOut
   - isAdmin
   - uploadFile
   - getRefreshToken
   - userValidation


✅ Seed API For Testing 
1. GET /api/seed/users -> users create (D)
2. GET /api/seed/products -> products create (D)


✅ package that we will need
 - `npm install express cors http-errors multer body-parser bcrypt jsonwebtoken nodemailer cookie-parser express-validator dotenv express-rate-limit mongoose slugify xss-clean`
 - `npm install --save-dev morgan nodemon`
  