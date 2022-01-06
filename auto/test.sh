#!/bin/sh

docker run \
-d \
-p 3000:80 \
-e ENTITIES="persons" \
--rm \
--name m-data \
k1r0s/m-data
