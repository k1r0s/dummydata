#!/bin/sh

curl -H "Content-Type: application/json" -X PUT -d '{ "age": 42 }' "localhost:3000/model/persons?name=Malik%20Hyen" -v

