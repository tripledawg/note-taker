const express = require('express');
const path = require('path');
const fs = require('fs');
// const { notStrictEqual } = require('assert');

const app = express();
const PORT = process.env.prt || 3001;

app.use(express.static('public')); //middleware

app.get('/api/notes', (req, res) => {  //endpoint 
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

//if you do a get('/endpoint', (req, res)) then you are assigning an endpoint

// app.get('/send', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/someFile.html'))
// );

// app.get('/routes', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/routes.html'))
// );

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);


//next, write note