#!/bin/sh
# This script reinstall the project. Keep careful,

yarn concurrently \
  "rimraf ./node_modules" \
  "rimraf ./package-lock.json" \
  "rimraf ./.next" \
  "rimraf ./out" \
  "rimraf ./storybook-static"

yarn
