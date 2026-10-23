#!/bin/bash
# Submit EAS build #3 (v2, v1.1.0). Success = a NEW build id appears that is
# neither build #1 (ERRORED) nor build #2 (FINISHED v1).
cd /home/hatch/workspace/fitpulse-app/fitpulse-expo || exit 1
export NODE_OPTIONS="--max-old-space-size=384 --max-semi-space-size=16 --dns-result-order=ipv4first"
export UV_THREADPOOL_SIZE=2
EAS=~/workspace/tools/eas/node_modules/.bin/eas
APPID=50aeb6fe-c390-4447-b246-13a9a8408f8d
OLDIDS="169ff339-43e6-4493-8c90-c6e07b3cdc48 a288d854-4cd2-4825-84d3-f07ca5883a75"
LOG=/tmp/eas-loop4.log

check_new() {
  IDS=$(curl -s --max-time 45 -X POST https://api.expo.dev/graphql \
    -H "Content-Type: application/json" -H "Authorization: Bearer $EXPO_TOKEN" \
    -d "{\"query\":\"query(\$appId: String!, \$offset: Int!, \$limit: Int!) { app { byId(appId: \$appId) { builds(offset: \$offset, limit: \$limit) { id status } } } }\",\"variables\":{\"appId\":\"$APPID\",\"offset\":0,\"limit\":5}}" \
    | grep -o '"id":"[a-f0-9-]*"' | sed 's/"id":"//;s/"//')
  for id in $IDS; do
    skip=0
    for old in $OLDIDS; do [ "$id" = "$old" ] && skip=1; done
    [ $skip -eq 0 ] && { echo "$id"; return; }
  done
}

for i in $(seq 1 10); do
  echo "=== attempt $i $(date +%T) ===" >> $LOG
  CI=1 $EAS build --platform android --profile preview --non-interactive --no-wait >> $LOG 2>&1
  echo "cli exit: $?" >> $LOG
  sleep 4
  NEW=$(check_new)
  echo "new build: ${NEW:-none}" >> $LOG
  if [ -n "$NEW" ]; then echo "SUBMITTED_OK $NEW"; exit 0; fi
  sleep 8
done
echo ALL_ATTEMPTS_FAILED
exit 1
