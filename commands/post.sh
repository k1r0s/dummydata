#!/bin/sh

curl -H "Content-Type: application/json" -X POST -d '{ "name": "Malik Hyen", "age": 32 }' "localhost/model/persons" -v
