#!/bin/sh

docker run \
-d \
--rm \
--network host \
--name coredb-service \
k1r0s/coredb-service
