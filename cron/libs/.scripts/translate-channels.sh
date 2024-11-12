#!/bin/bash
cd /root/installsat 
yarn ts-node cron/translate-channels.mjs > /dev/null 2>&1

# 0 10-23 * * * /root/installsat/cron/libs/.scripts/translate-channels.sh > /dev/null 2>&1
# 0 0-7 * * * /root/installsat/cron/libs/.scripts/translate-channels.sh > /dev/null 2>&1
