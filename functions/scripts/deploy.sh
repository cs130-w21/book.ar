#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_DIR="${DIR}/../src"

gcloud functions \
  deploy bookar \
  --source=$SOURCE_DIR
  --runtime=python37 \
  --trigger-http \
  --allow-unauthenticated