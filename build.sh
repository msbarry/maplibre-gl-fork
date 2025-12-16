#!/usr/bin/env bash
set -ex
npm ci
rm -rf dist
npm run build-dist