#!/usr/bin/env node
'use strict'



const fs = require('fs');
const path = require('path');
const petsPath = path.join('./', 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/pets', (req, res) => {
	fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
		if (err) {
			console.log(err.stack);
			return res.sendStatus(500);
		}
		const pets = JSON.parse(petsJSON);
		res.set('Content-Type', 'application/json');
		res.send(pets);
	})
})

app.get('/pets/:id', (req, res) => {
	fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
		if (err) {
			console.log(err.stack);
			return res.sendStatus(500);
		}
		const id = Number.parseInt(req.params.id);
		const pets = JSON.parse(petsJSON);

		if (id < 0 || id >= pets.length || Number.isNaN(id)) {
			res.set('Content-Type', 'text/plain');
			res.sendStatus(404);
		} else {
			res.set('Content-Type', 'application/json');
			res.send(pets[id]);
		}
	})
})

app.post('/pets', (req, res) => {
	fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
		const petsArray = JSON.parse(petsJSON)
		const age = Number(req.body.age);
		const kind = req.body.kind;
		const name = req.body.name;
		const pet = {'age': age, 'kind': kind, 'name': name};

		if (!age || !kind || !name) {
			console.error(`shit happens`);
			return res.sendStatus(400);
		}
			petsArray.push(pet);
			const JSONpets = JSON.stringify(petsArray);

			fs.writeFile(petsPath, JSONpets, function(writeErr) {
				if(writeErr){
					throw writeErr;
				}
				res.set('Content-Type', 'application/json');
				res.send(pet);
			});
	})
})

app.use((req, res, next) => {
	res.sendStatus(404);
})

app.listen(port, function(){
	console.log('Listening on port', port);
})

module.exports = app;
