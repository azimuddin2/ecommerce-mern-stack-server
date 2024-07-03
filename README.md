# E-commerce MERN Stack Project
# Back-end Development



✅ Users API
🔖 User model and schema with validations for user

1. POST /api/users/process-register -> create the user account (D)
    - get multi-part form data from the request body using multer
    - input validation check -> presence, image size, user exist
    - password hashing with bcrypt
    - create a jwt for storing user data temporarily
    - for jwt secret key: require("crypto").randomBytes(64).toString('hex')
    - send email with nodemailer (SMTP gmail username, password)

2. POST /api/users/activate -> activate the user account (D)
    - get the jwt from request
    - check existance of jwt
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
    - check user's existance
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
    - if verified - clear exisitng cookie, create refresh token (new token), cookie, return refresh token

4. GET /api/auth/protected -> protected route (D)


✅ Category API
🔖 Create category schema and model
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
🔖 create product schema and model
    - ref Category model
    - create product validation
    - create product routes and controller

1. POST /api/products -> create product (D)
2. GET /api/products -> get all products (D)
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








# Project planning
1. Environment setup
2. Create express server
3. HTTP request & response
4. nodemon and morgan package
5. API testing with postman
6. Middleware & types of Middleware
7. Express error handling middleware
8. How to handle HTTP errors -> http errors
9. How to secure API -> xss-clean, express-rate-limit
10. Environment variable & .gitignore
11. MVC pattern in software architecture
12. Connect to MongoDB database
13. Schema & Model fo user
14. Create seed route for testing
15. GET /api/users -> isAdmin -> getAllUsers -> search + pagination functionality
16. responseHandler controller for error & success
17. GET /api/users/:id -> get a single user by id
18. How to create services in the backend
19. DELETE /api/users/:id -> delete a single user by id
20. Refactoring & reusability, dynamic
21. deleteImage helper
22. POST /api/users/process-register -> process the registration
23. create json web token
24. setup smtp server & prepare email
25. send email with nodemailer
26. POST /api/users/verify -> verify + register into database
27. add multer middleware for file upload
28. filtering files by size and types
29. add express validator middleware
30. should we store image as string or buffer
31. PUT /api/users/:id -> update a single user by id
32. POST /api/auth/login -> user login
33. POST /api/auth/logout -> user logout
34. Middleware -> isLoggedIn, isLoggedOut, isAdmin
35. input validation when signed in and refactoring
36. PUT /api/users/banned-user/:id -> banned user
37. PUT /api/users/unbanned-user/:id -> unbanned user
38. PUT /api/users/update-password/:id -> update the password
39. POST /api/users/forget-password -> forget the password
40. PUT /api/users/reset-password -> reset the password