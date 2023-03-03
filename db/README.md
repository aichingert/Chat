# Chat - Express and Database

The db folder handles the database and express endpoints

## Entity's

* User
  * name: varchar
  * password: varchar
---
* Chat
  * new: integer
  * user1_id: integer
  * user2_id: integer
---
* Message
  * content: varchar
  * written_at: bigint
  * chat_id: integer
  * user_id: integer
---

## Routes
```` javascript
// Post /login => checks if user is in db and if it is starts the session
"/login", JSON(User)

// Post /logout => checks if user is in db and if it is ends the session
"/logout", JSON(User)

// Post /register => checks that username is not taken if not adds user to db and starts session
"/register", JSON(User)

// Get /user/chats => checks if user is in db and then returns the chats for that user
"/user/chats", JSON(User) 
    
// Get /chats/:chatId => returns the chat with the chadId
"/chats/:chatId", chatId

// Debugging routes
// Get /see/users => returns all users in db
"/see/users", ()

// Get /see/chats => returns all chats in db
"/see/chats", ()

// Get /see/messages => returns all messages in db
"/see/messages", ()
````