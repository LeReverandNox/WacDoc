#!/bin/bash

args=
for arg in "$@";
do
  args="$args '$arg'"
done

# force le changement d'id utilisateur
if [ ! -z $UID ] && [ $UID != "1000" ]; then
    su -c 'usermod -u $UID node'
fi

# change l'id de groupe de l'utilisateur
if [ ! -z $GID ] && [ $GID != "1000" ]; then
    su -c 'groupmod -g $GID node'
fi

exec su node -c "$args"