#!/bin/bash
# Submit EAS build #2 (.npmrc legacy-peer-deps fix). Success = a NEW build id
# appears (different from the ERRORED first build).
cd /home/hatch/workspace/fitpulse-app/fitpulse-expo || exit 1
export NODE_OPTIONS="--max-old-space-size=384 --max-semi-space-size=16 --dns-result-order=ipv4first"
export UV_THREADPOOL_SIZE=2
EAS=~/workspace/tools/eas/node_modules/.bin/eas
APPID=50aeb6fe-c390-4447-b246-13a9a8408f8d
OLDID=169ff339-43e6-4493-8c90-c6e07b3cdc48
LOG=/tmp/eas-loop2.log

check_new() {
  curl -s --max-time 45 -X POST https://api.expo.dev/graphql \
    -H "Content-Type: application/json" -H "Authorization: Bearer $EXPO_TOKEN" \
    -d "{\"query\":\"query(\$appId: String!, \$offset: Int!, \$limit: Int!) { app { byId(appId: \$appId) { builds(offset: \$offset, limit: \$limit) { id status } } } }\",\"variables\":{\"appId\":\"$APPID\",\"offset\":0,\"limit\":5}}" \
    | grep -o '"id":"[a-f0-9-]*"' | grep -v "$OLDID" | head -1
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
