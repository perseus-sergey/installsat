#!/bin/bash
sleep $[RANDOM % 60]m ; cd /root/installsat && yarn ts-node cron/trans-news.mjs > /dev/null 2>&1