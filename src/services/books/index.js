import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const booksRouter = express.Router()

const booksJSONPath = join(dirname(fileURLToPath(import.meta.url)), "books.json") // Please do not use "+" symbol to concatenate two paths, always use JOIN instead

const getBooks = () => JSON.parse(fs.readFileSync(booksJSONPath))
const writeBooks = content => fs.writeFileSync(booksJSONPath, JSON.stringify(content))

// 1.

booksRouter.post("/", (req, res) => {
  const newBook = { ...req.body, createdAt: new Date(), id: uniqid() }
  const books = getBooks()

  books.push(newBook)
  writeBooks(books)
  res.status(201).send({ id: newBook.id })
})

// 2.

booksRouter.get("/", (req, res) => {
  const books = getBooks()
  res.send(books)
})

// 3.

booksRouter.get("/:bookId", (req, res) => {
  const books = getBooks()

  const book = books.find(b => b.id === req.params.bookId)

  res.send(book)
})

// 4.

booksRouter.put("/:bookId", (req, res) => {
  const books = getBooks()

  const index = books.findIndex(b => b.id === req.params.bookId)

  const bookToModify = books[index]
  const updatedFields = req.body

  const updatedBook = { ...bookToModify, ...updatedFields, updatedAt: new Date() }

  books[index] = updatedBook

  writeBooks(books)

  res.send(updatedBook)
})

// 5.

booksRouter.delete("/:bookId", (req, res) => {
  const books = getBooks()
  const remainingBooks = books.filter(book => book.id !== req.params.bookId)
  writeBooks(remainingBooks)
  res.status(204).send()
})

export default booksRouter
