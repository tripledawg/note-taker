const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
// const { notStrictEqual } = require('assert');

const app = express();
const PORT = process.env.prt || 3001;

app.use(express.static('public')); //middleware
app.use(express.json());

app.get('/api/notes', (req, res) => {  //endpoint 
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
})

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html')) //fallback route in case route not defined
);

app.post('/api/notes', (req, res) => {
    if (req.body) {
        let note = req.body;
        console.log(req.body);
        let dataBase = db;
        dataBase.push(note);
        fs.writeFile('/db/db.json', dataBase.toString(), (err, data) => {
            if (err) throw err;
            console.log(data);
        });
        res.status(200).json(`Note added!`);
        return;
    }
    else {
        res.status(400).json('Note not found in request');
    }
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);


//next, write note