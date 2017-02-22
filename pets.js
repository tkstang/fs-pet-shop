#!/usr/bin/env node
'use strict'

const fs = require('fs');
const path = require('path');
const petsPath = path.join('./', 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read'){
	fs.readFile(petsPath, 'utf8', function (err, data){
		if (err){
			console.error('Shit done fucked up son');
      process.exit(1);
		}
		const pets = JSON.parse(data);
		const pet = process.argv[3];
		if (!pet) {
			console.log(pets);
		} else if (pets[pet] === undefined){
			console.error(`Usage: ${node} ${file} read PET`);
		} else if (pet) {
			console.log(pets[pet]);
		}
	})
} else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
			console.error('Shit done fucked up son');
      process.exit(1);
    }

		const pets = JSON.parse(data);
		const age = parseInt(process.argv[3]);
		const kind = process.argv[4];
		const name = process.argv[5];

    if (!age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

		const pet = {'age': age, 'kind': kind, 'name': name};
    pets.push(pet);
		const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pet);
    });
  });
} else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
			console.error('Shit done fucked up son');
      process.exit(1);
    }

		const pets = JSON.parse(data);
		const index = parseInt(process.argv[3]);
		const age = parseInt(process.argv[4]);
		const kind = process.argv[5];
		const name = process.argv[6];

    if (!index || !age || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

		const pet = {'age': age, 'kind': kind, 'name': name};
    pets[index] = pet;
		const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pet);
    });
  });
} else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
			console.error('Shit done fucked up son');
      process.exit(1);
    }

		const pets = JSON.parse(data);
		const index = parseInt(process.argv[3]);

    if (!index) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
    const destroyedPet = pets[index];
    pets.splice(index,1);
		const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(destroyedPet);
    });
  });
} else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
