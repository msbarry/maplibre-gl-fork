#!/usr/bin/env bash
set -ex
npm ci
rm -rf dist
npm run build-dev
npm run build-prod
npm run build-css
npm run generate-typings