#!/bin/bash
cd /root/installsat
yarn ts-node cron/yearly_copy_tbl_digest.mjs > /dev/null 2>&1

#10 2 2 1 * /root/installsat/cron/libs/.scripts/yearly_copy_tbl_digest.sh > /dev/null 2>&1