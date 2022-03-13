#!/bin/sh

docker run \
-d \
--restart always \
-v /home/pi/db:/app/persistancefs \
-e ENTITIES="reports,products" \
--network rpinet \
--name m-data \
k1r0s/m-data
