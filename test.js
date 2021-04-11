const query = require("./query");

let persons = [];

persons.push({ "name": "Jon", "age": 33 });
persons.push({ "name": "Pac", "age": 28 });
persons.push({ "name": "Pep", "age": 24 });

const predicate = query.buildPredicate("age,gt,26:age,lt,32");

console.log(predicate.toString());

const filtered = persons.filter(predicate);

console.log(filtered);
