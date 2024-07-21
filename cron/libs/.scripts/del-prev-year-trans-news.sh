#!/bin/bash
cd /root/installsat
yarn ts-node cron/del-prev-year-trans-news.mjs > /dev/null 2>&1

#20 3 17 7 * /root/installsat/cron/libs/.scripts/del-prev-year-trans-news.sh > /dev/null 2>&1