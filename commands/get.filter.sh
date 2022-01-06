#!/bin/sh

# curl "localhost:3000/persons?name,sw,Jerso" -v # lookup
curl "localhost:3000/persons?name,sw,zzz" -v # lookup

# curl "localhost:3000/persons/COYdpcCsc9" -v # fetch specific id
