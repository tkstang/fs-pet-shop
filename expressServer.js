#!/usr/bin/env node
'use strict'

const fs = require('fs');
const path = require('path');
const petsPath = path.join('./', 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

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

app.listen(port, function(){
	console.log('Listening on port', port);
})

module.exports = app;
