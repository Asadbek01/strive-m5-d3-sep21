// const express = require("express") <-- OLD IMPORT SYNTAX

import express from "express" // <-- NEW IMPORT SYNTAX (Enabled with "type": "module" in the package.json)
import listEndpoints from "express-list-endpoints"

import usersRouter from "./services/users/index.js"

const server = express()

const port = 3001 // every process on this computer needs to have a different port number

server.use(express.json()) // If you don't add this line BEFORE the endpoints all request bodies will be undefined

// ******************** ENDPOINTS ***********************

server.use("/users", usersRouter)

// console.log(listEndpoints(server))
console.table(listEndpoints(server))

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
