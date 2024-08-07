#!/bin/bash
sleep $[RANDOM % 90]m
cd /root/installsat 
yarn ts-node cron/satellite-news.mjs > /dev/null 2>&1

# 0 5,12 * * * /root/installsat/cron/libs/.scripts/satellite-news.sh > /dev/null 2>&1