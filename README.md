s0cket
======

s0cket is a social media platform for developers built on the MERN stack.

Progress 
--------

- [x] Backend API
- [ ] Frontend

Run the API Locally
-------------------
* Clone repository `git clone https://github.com/arghp/s0cket`
* Install dependencies `npm install`
* Run development server `npm run server`
* The server will be running at `http://localhost:5000`

API Routes
----------

```
user routes
-----------
POST    api/users                          Register a user
POST    api/auth                           Authenticate user & get token

profile routes
--------------
POST    api/profiles                       Create or update user profile
GET     api/profiles                       Get all profiles
GET     api/profiles/:user_id              Get profile by user ID
DELETE  api/profiles                       Delete profile, user & posts
PUT     api/profiles/experiences           Add profile experience
DELETE  api/profiles/experiences/:exp_id   Delete profile experience
PUT     api/profiles/education             Add profile education
DELETE  api/profiles/education/:edu_id     Delete profile education
GET     api/profiles/github/:username      Get user repos from Github

post routes
-----------
POST    api/posts                          Create a post
GET     api/posts                          Get all posts
GET     api/posts/:id                      Get post by id
DELETE  api/posts/:id                      Delete a post
PUT     api/posts/:id/like                 Like a post
PUT     api/posts/:id/unlike               Unlike a post
PUT     api/posts/:id/comment              Comment on a post
PUT     api/posts/:id/comment/:comment_id  Remove a comment
PUT     api/posts/:id                      Edit a post

inbox routes
------------
GET     api/messages/                      Get current user's messages (?view = inbox for an inbox view, with latest message for each conversation)
GET     api/messages/user/:id              Get messages with user of id
POST    api/messages/user/:id              Send a new message to user of id
```