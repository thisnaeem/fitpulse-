#!/bin/bash
# EAS submit with a capped Node heap: this VM is memory-starved and the
# uncapped CLI gets killed mid-run. Loop until the build exists server-side.
cd /home/hatch/workspace/fitpulse-app/fitpulse-expo || exit 1
export NODE_OPTIONS="--max-old-space-size=384 --max-semi-space-size=16 --dns-result-order=ipv4first"
export UV_THREADPOOL_SIZE=2
EAS=~/workspace/tools/eas/node_modules/.bin/eas
APPID=50aeb6fe-c390-4447-b246-13a9a8408f8d
LOG=/tmp/eas-loop.log

check_builds() {
  curl -s --max-time 45 -X POST https://api.expo.dev/graphql \
    -H "Content-Type: application/json" -H "Authorization: Bearer $EXPO_TOKEN" \
    -d "{\"query\":\"query(\$appId: String!, \$offset: Int!, \$limit: Int!) { app { byId(appId: \$appId) { builds(offset: \$offset, limit: \$limit) { id status artifacts { applicationArchiveUrl } } } } }\",\"variables\":{\"appId\":\"$APPID\",\"offset\":0,\"limit\":3}}"
}

for i in $(seq 1 10); do
  echo "=== attempt $i $(date +%T) ===" >> $LOG
  CI=1 $EAS build --platform android --profile preview --non-interactive --no-wait >> $LOG 2>&1
  echo "cli exit: $?" >> $LOG
  sleep 4
  RES=$(check_builds)
  echo "server: $RES" >> $LOG
  if echo "$RES" | grep -q '"builds":\[{"id"'; then echo "SUBMITTED_OK" >> $LOG; echo SUBMITTED_OK; exit 0; fi
  sleep 8
done
echo "ALL_ATTEMPTS_FAILED" >> $LOG
echo ALL_ATTEMPTS_FAILED
exit 1
