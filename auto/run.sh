#!/bin/sh

docker run \
-d \
--restart always \
-v /home/pi/db:/app/persistancefs \
--network rpinet \
--name coredb-service \
k1r0s/coredb-service
