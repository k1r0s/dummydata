const query = require("./query");

let persons = [];

persons.push({ "name": "Jon", "age": 33, subprops: { some: 2} });
persons.push({ "name": "Pac", "age": 28, subprops: { some: 5 } });
persons.push({ "name": "Pep", "age": 24, subprops: { some: 3 } });

const predicate = query.buildPredicate("subprops.some,eq,3");

const filtered = persons.filter(predicate);

console.log(filtered);
