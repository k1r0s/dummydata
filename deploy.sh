#!/bin/sh

npm pack
# scp m-data-1.0.0.tgz pi@k1r0s.dnsup.net:/home/pi/update
scp m-data-1.0.0.tgz root@192.168.1.227:/home/pi/update
rm -rf m-data-1.0.0.tgz
