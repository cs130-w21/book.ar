#!/bin/bash

set -e

for arg in "$@"; do
  case "$arg" in
    -d | --debug)         DEBUG=true           ;;
  esac
  shift
done

if [[ $DEBUG == true ]]; then
  printf "==================\n"
  printf "Debug mode enabled\n"
  printf "==================\n"
fi

function debug() {
  if [[ $DEBUG == true ]]; then
    printf "$@\n"
  fi
}

function error {
  printf "\e[91;5;81m$@\e[0m\n"
}

function success {
  printf "\e[32;5;81m$@\e[0m\n"
}

BRANCH=`git rev-parse --abbrev-ref HEAD`

if [[ $BRANCH == main || $BRANCH == HEAD ]]; then
  CHANGED_FILES=`git diff HEAD~1 HEAD --name-only server/`
else 
  CHANGED_FILES=`git diff origin/main HEAD --name-only server/`
fi

SKIP_EXTENSIONS=(".md")
RUN_CI=false

for FILE in $CHANGED_FILES; do
  debug "Checking $FILE ... "
  SKIP=false
  for EXTENSION in $SKIP_EXTENSIONS; do
    if [[ $FILE =~ $EXTENSION ]]; then
      SKIP=true
      debug "*** Skipping $File because it is a $EXTENSION file"
      break
    fi
  done
  if [[ $SKIP == false ]]; then
    debug "*** $FILE requires a new build"
    RUN_CI=true
    break
  fi
done

if [[ $RUN_CI == false ]]; then
  error "No changes in the server subdirectory. Aborting build..."
  exit 1
else
  success "Found changes to the server subdirectory. Continuing with build..."
fi