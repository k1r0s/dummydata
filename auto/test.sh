#!/bin/sh

docker run \
-ti \
-p 3000:80 \
-e ENTITIES="persons" \
--rm \
--name m-data \
k1r0s/m-data
