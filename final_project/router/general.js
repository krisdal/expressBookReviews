const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

public_users.post("/register", function (req, res) {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  console.log("Register user: ", username);

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Function to return a promise that resolves with the list of books
function getBooks() {
  return new Promise((resolve, reject) => {
    // Simulate async operation, like fetching from a database
    if (books) {
      resolve(books); // Resolve the promise with the books data
    } else {
      reject("No books found"); // Reject the promise if something goes wrong
    }
  });
}


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  getBooks()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
  //  return res.send(JSON.stringify({ books }, null, 2));
  //return res.status(300).json({ message: "Yet to be implemented" });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  // Filter the users array to find users whose email matches the extracted email parameter
  let book = books[isbn];
  res.send(JSON.stringify({ book }, null, 2));

  //  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let keys = Object.keys(books);
  let matchingBooks = [];

  keys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.send(JSON.stringify({ matchingBooks }, null, 2));
  }
  else {
    return res.status(404).json({ message: "No books found" });
  }

  //  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let keys = Object.keys(books);
  let matchingBooks = [];

  keys.forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.send(JSON.stringify({ matchingBooks }, null, 2));
  }
  else {
    return res.status(404).json({ message: "No books found" });
  }
  //  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  // Filter the users array to find users whose email matches the extracted email parameter
  let book = books[isbn];
  res.send(book["reviews"]);
  //return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
