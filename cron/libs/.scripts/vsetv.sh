#!/bin/bash
sleep $[RANDOM % 90]s ; cd /root/installsat && yarn ts-node cron/vsetv.mjs > /dev/null 2>&1