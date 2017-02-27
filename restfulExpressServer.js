#!/usr/bin/env node
'use strict'

const fs = require('fs');
const path = require('path');
const petsPath = path.join('./', 'pets.json');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const basicAuth = require('basic-auth');
app.use(bodyParser.json());
app.use(morgan("combined"));

const auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm="Required"');
    return res.send(401);
  };

  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'admin' && user.pass === 'meowmix') {
    return next();
  } else {
    return unauthorized(res);
  };
};

app.use(auth);

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

app.get('/pets', auth, (req, res) => {
	console.log("hello");
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
		const pet = pets[id];
		const petString = JSON.stringify(pet);
		if (!pet){
			res.set('Content-Type', 'text/plain');
			res.sendStatus(404);
		} else if (id < 0 || id >= pets.length || Number.isNaN(id)) {
			res.set('Content-Type', 'text/plain');
			res.sendStatus(404);
		} else {
		res.set('Content-Type', 'application/json');
		res.send(petString);
		}
	});
});

app.patch('/pets/:id', (req, res) => {
	fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
		if (err) {
			console.log(err.stack);
			return res.sendStatus(500);
		}
		const id = Number.parseInt(req.params.id);
		const pets = JSON.parse(petsJSON);
		const pet = pets[id];
		const age = Number(req.body.age);
		const kind = req.body.kind;
		const name = req.body.name;

		if (kind){
			pet.kind = kind;
		}
		if (age){
			pet.age = age;
		}
		if (name){
			pet.name = name
		}

		const petsString = JSON.stringify(pets);

		fs.writeFile(petsPath, petsString, function(writeErr) {
			if(writeErr){
				throw writeErr;
			}
			res.set('Content-Type', 'application/json');
			res.send(pet);
		});
	})
})

app.delete('/pets/:id', (req, res) => {
	fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
		if (err) {
			console.log(err.stack);
			return res.sendStatus(500);
		}
		const id = Number.parseInt(req.params.id);
		const pets = JSON.parse(petsJSON);
		console.log(pets)
		const pet = pets[id];
		pets.splice(id, 1);

		const petsString = JSON.stringify(pets);

		fs.writeFile(petsPath, petsString, function(writeErr) {
			if(writeErr){
				throw writeErr;
			}
			res.set('Content-Type', 'application/json');
			res.send(pet);
		});
	})
})

// app.use((req, res, next) => {
// 	res.sendStatus(404);
// })

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, function(){
	console.log('Listening on port', port);
})

module.exports = app;
