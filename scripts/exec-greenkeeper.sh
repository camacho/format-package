#!/usr/bin/env sh

# Add greenkeeper-lockfile to global to keep workspace node_modules clean

PATH="$(yarn global dir)/node_modules/.bin:$PATH"

set -eux;

yarn global add greenkeeper-lockfile@next

exec "$@"
