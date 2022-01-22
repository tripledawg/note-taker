//required global constants
const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

//initilizing express app 
const app = express();

//establishing PORT as a process environment port for heroku, with a backup port of local:3001;
const port = process.env.PORT || 3001;

//establishing 
app.listen(port, () =>
    console.log(`Note app listening at http://localhost:${port}`)
);

//middleware
app.use(express.static('public')); //creates a static path for all files in public folder
app.use(express.json()); //allows text output as JSON format

//establishing server routes
//establishing endpoint for the saved notes
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'));
});

//establishing endpoint for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//establising endpoint for getting started page and also any unassigned routes
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

//establishing endpoint for writing notes
//if the request body has content, assign it to the note variable and give it an id using the UUID node module 
//then push the note onto the JSON db array then use the file system module's writeFile method to turn the JSON object into a string 
//and write the file to the db.JSON file in the db folder
//callback included to return the note and a 200 status if all was well or a 400 status if not
app.post('/api/notes', (req, res) => {
    if (req.body) {
        let note = req.body;
        console.log(req.body);
        note.id = uuidv4();
        db.push(note);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err, data) => {
            if (err) {
                console.log('Data is : ' + data);
                throw err;
            }
        });
        res.status(200).json(note);
        return;
    }
    else {
        res.status(400).json('Note not found in request');
    }
});

//BONUS delete method

//if the unique id is equal to the id of the note with the delete request
app.delete('/api/notes/:id', (req, res) => {
    let noteIndex = db.findIndex((note) => note.id == req.params.id); //find the index of a note of it has an id equal to the passed in id
    if (noteIndex) {
        db.splice(noteIndex, 1);  //then take out that one note starting at that index position
        fs.writeFile('./db/db.json', JSON.stringify(db), (err, data) => {
            if (err) {
                console.log('Data is : ' + data);
                throw err;
            }
        });
        return res.status(200).json('Note deleted.');
    }
    return res.status(404).json('Note not found.');
});




