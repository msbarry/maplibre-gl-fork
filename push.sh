#!/usr/bin/env bash
set -ex
npm version prerelease
./build.sh
npm publish