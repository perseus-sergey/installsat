#!/bin/bash
sleep $[RANDOM % 60]m ; cd /root/installsat && yarn ts-node cron/it999_schedule.mjs > /dev/null 2>&1

# 0 8 * * 1 /root/installsat/cron/libs/.scripts/it999_schedule.sh > /dev/null 2>&1
# 0 20 * * 5 /root/installsat/cron/libs/.scripts/it999_schedule.sh > /dev/null 2>&1