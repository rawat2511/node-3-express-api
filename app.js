const express = require('express');
const fs = require('fs');
const app = express();
let books = require('./books.json');

const PORT = 8000;

const logger = (req, res, next) => {
    req.user = { api_requested_by: "Shubham Rawat"};
    next();
}


app.listen(PORT, () => {
    console.log("Listening to port : ", PORT);
});

app.get('/', logger, (req, res) => {
    console.log("Inside get : User : ", req.user);
    res.json({...req.user, "books": books});
})

app.post('/books', express.json(), (req, res) => {
    let data = req.body;
    books.push(data);
    fs.writeFileSync('books.json', JSON.stringify(books));
    res.json(data);
})

app.get('/books/:id', logger, (req, res) => {
    const {id} = req.params;
    const book = books.find((book) => book.id === Number.parseInt(id));
    res.json(book ? {...req.user, book} : {"404" : `Book with id : ${id} is not present`});
})

app.patch('/books/:id', express.json(), (req, res) => {
    const {id} = req.params;
    const index = books.findIndex((book) => Number.parseInt(id) === book.id );
    const data = {...books[index], ...req.body};
    books.splice(index, 1, data);
    fs.writeFileSync('books.json', JSON.stringify(books));
    res.json(books);
})

app.delete('/books/:id', (req, res) => {
    const {id} = req.params;
    let index = books.findIndex((book) => book.id === Number.parseInt(id));
    books.splice(Number.parseInt(index), 1)
    fs.writeFileSync("books.json", JSON.stringify(books));
    res.json(books);
})