#!/bin/bash
sleep $[RANDOM % 90]m ; cd /root/installsat && yarn ts-node cron/vsetv.mjs > /dev/null 2>&1