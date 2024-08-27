#!/bin/bash
sleep $[RANDOM % 90]m
cd /root/installsat 
yarn ts-node cron/fly-satellites.mjs > /dev/null 2>&1

# 30 8 * * * /root/installsat/cron/libs/.scripts/fly-satellites.sh > /dev/null 2>&1