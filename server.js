const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

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
        note.uuid = uuidv4();
        db.push(note);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err, data) => {
            if (err) throw err;
            console.log('Data is : ' + data);
        });
        res.status(200).json(note);
        return;
    }
    else {
        res.status(400).json('Note not found in request');
    }
});

// ///
// const { title, text } = req.body;

// if (title && text) {
//     // Variable for the object we will save
//     const newNote = {
//       title,
//       text,
//       upvotes: Math.floor(Math.random() * 100),
//       review_id: uuid(),
//     };

// // Convert the data to a string so we can save it
// const noteString = JSON.stringify(newNote);

// // Write the string to a file
// fs.writeFile(`./db/${newNote.title}.json`, noteString, (err) =>
//   err
//     ? console.error(err)
//     : console.log(
//         `Review for ${newNote.title} has been written to JSON file`
//       )
// );
// ////


app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);


//next, write note