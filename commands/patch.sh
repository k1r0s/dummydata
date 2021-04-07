#!/bin/sh

curl -X PATCH -H "Content-Type: text/plain" -d 'value => ({ ...value, age: value.age + 1 })' "localhost/model/persons?name=Malik%20Hyen" -v
