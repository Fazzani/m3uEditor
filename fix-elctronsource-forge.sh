#!/bin/bash

cat > 'node_modules/.bin/electron-forge-vscode-nix'  <<- EOM
#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ARGS=$@
ARGS=${ARGS// /\~ \~}

node $DIR/../@electron-forge/cli/dist/electron-forge-start --vscode -- \~$ARGS\~
EOM