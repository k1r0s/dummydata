#!/bin/sh

npm pack
scp m-data-1.0.0.tgz pi@k1r0s.dnsup.net:/home/pi/update
rm -rf m-data-1.0.0.tgz
