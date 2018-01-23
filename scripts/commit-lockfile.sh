#!/usr/bin/env bash
set -e

LOCKFILE="yarn.lock"

# this script is only for CircleCI
if [[ -z $CIRCLECI ]]; then
	echo "script must be run in CircleCI";
	exit 1;
fi

# only continue if lockfile has changed
git diff --exit-code $LOCKFILE && { echo "${LOCKFILE} is up to date"; exit 0; }

USER_EMAIL=${USER_EMAIL:-"circleci@users.noreply.github.com"}
USER_NAME=${USER_NAME:-"CircleCI"}

# Setup git for this user
git config user.email $USER_EMAIL
git config user.name $USER_NAME
git config push.default simple

echo "git config $USER_NAME <$USER_EMAIL>";

# Output the diff to CI
git --no-pager diff $LOCKFILE

# Commit and push lockfile
git add $LOCKFILE
git commit -nm "chore(dependencies): update ${LOCKFILE}"
git push --no-verify origin $CIRCLE_BRANCH
