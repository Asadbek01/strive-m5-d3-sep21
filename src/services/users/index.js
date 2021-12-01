// ************************** USERS ENDPOINTS ************************************

// ************************** USERS CRUD **************************************

// 1. CREATE --> POST http://localhost:3001/users/ (+body)
// 2. READ --> GET http://localhost:3001/users/ (+ optional query parameters)
// 3. READ --> GET http://localhost:3001/users/:userId
// 4. UPDATE --> PUT http://localhost:3001/users/:userId (+body)
// 5. DELETE --> DELETE http://localhost:3001/users/:userId

import express from "express" // 3RD PARTY MODULE (npm i express)
import fs from "fs" // CORE MODULE (doesn't need to be installed)
import { fileURLToPath } from "url" // CORE MODULE (doesn't need to be installed)
import { dirname, join } from "path" // CORE MODULE (doesn't need to be installed)
import uniqid from "uniqid" // 3RD PARTY MODULE (npm i uniqid)

const usersRouter = express.Router()

// *********** users.json path ********************

// 1. I'll start from the path of current file I am in right now

const currentFilePath = fileURLToPath(import.meta.url) // C:\\Strive\\FullStack\\2021\\Sep21\\M5\\strive-m5-d2-sep21\\src\\services\\users\\index.js

// 2. From currentFilePath I can obtain the parent folder's path C:\\Strive\\FullStack\\2021\\Sep21\\M5\\strive-m5-d2-sep21\\src\\services\\users

const currentFolderPath = dirname(currentFilePath)

// 3. I can concatenate currentFolderPath with users.json C:\\Strive\\FullStack\\2021\\Sep21\\M5\\strive-m5-d2-sep21\\src\\services\\users\\users.json

const usersJSONPath = join(currentFolderPath, "users.json")

// ************************************************

// 1.

usersRouter.post("/", (req, res) => {
  // (req, res) => {} is the endpoint handler function, req === REQUEST, res === RESPONSE <-- PARAMETER ORDER MATTERS (NAME DOESN'T)

  // 1. Read the request body to obtain the new user's data

  console.log("BODY: ", req.body)

  // 2. Add some server generated information (id, creationDate, ....)

  const newUser = { ...req.body, createdAt: new Date(), id: uniqid() }

  console.log(newUser)

  // 3. Read users.json obtaining an array

  const users = JSON.parse(fs.readFileSync(usersJSONPath))

  // 4. Add new user to the array (push)
  users.push(newUser)

  // 5. Write the array back to the file
  fs.writeFileSync(usersJSONPath, JSON.stringify(users))

  // 6. Send back a proper response

  res.status(201).send({ id: newUser.id })
})

// 2.

usersRouter.get("/", (req, res) => {
  // 1. Read the content of users.json file
  // const users = [{ firstName: "Stefano" }, { firstName: "Diego" }, { firstName: "Tobia" }]
  console.log("IMPORT META URL: ", import.meta.url)
  console.log("CURRENT FILE PATH: ", currentFilePath)

  const fileContent = fs.readFileSync(usersJSONPath) // You obtain a BUFFER object, which is MACHINE READABLE ONLY

  console.log("FILE CONTENT: ", JSON.parse(fileContent))

  const usersArray = JSON.parse(fileContent)

  // 2. Send it back as response
  res.send(usersArray)
})

// 3.

usersRouter.get("/:userId", (req, res) => {
  console.log("USER ID: ", req.params.userId)

  // 1. Read the content of users.json file (obtaining an array)
  const users = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Find the user by id in the array
  const user = users.find(s => s.id === req.params.userId)

  // 3. Send the found user back as a response
  res.send(user)
})

// 4.

usersRouter.put("/:userId", (req, res) => {
  // 1. Read users.json obtaining an array
  const users = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Modify the specified user
  const index = users.findIndex(user => user.id === req.params.userId)
  const updatedUser = { ...users[index], ...req.body }

  users[index] = updatedUser

  // 3. Save the file back with the updated list of users
  fs.writeFileSync(usersJSONPath, JSON.stringify(users))

  // 4. Send back a proper response

  res.send(updatedUser)
})

// usersRouter.patch("/:userId/firstName")

// 5.

usersRouter.delete("/:userId", (req, res) => {
  // 1. Read the content of users.json file (obtaining an array of users)
  const users = JSON.parse(fs.readFileSync(usersJSONPath))

  // 2. Filter out the specified user from the array, keeping just the remaining users
  const remainingUsers = users.filter(user => user.id !== req.params.userId) // !== ! = =

  // 3. Save the remaining users back on users.json file
  fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers))

  // 4. Send back a proper response
  res.status(204).send() // 204 means empty content
})

// usersRouter.get("/example")

export default usersRouter
