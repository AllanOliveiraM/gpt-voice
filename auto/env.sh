#!/bin/sh
# This script create .env file if not exists.

cp .env.local .env.backup
cp .env.example .env.local
cp .env.backup .env.local

rm .env.backup

exit 0
