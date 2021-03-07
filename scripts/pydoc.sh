#!/bin/bash

FILES=()
while IFS= read -r line; do
  FILES+=("$line")
done < <(find ./server -type f -maxdepth 1 -name '*.py' -exec basename -s .py '{}' ';')

cd server

for FILE in ${FILES[@]}; do
  python3 -m pydoc -w $FILE
  mv "$FILE.html" "../out/$FILE.html"
done



cd ..


# echo $FILES