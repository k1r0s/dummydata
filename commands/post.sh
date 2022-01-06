#!/bin/sh

curl -H "Content-Type: application/json" -d '{ "name": "Malik Hyen", "age": 32 }' "localhost:3000/persons" -v
curl -H "Content-Type: application/json" -d '{ "name": "Shurik Tydre", "age": 36 }' "localhost:3000/persons" -v
curl -H "Content-Type: application/json" -d '{ "name": "Jerso Frett", "age": 23 }' "localhost:3000/persons" -v
