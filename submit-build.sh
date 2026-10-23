#!/bin/bash
# Retry EAS build submission until a build appears on the server (flaky proxy).
cd /home/hatch/workspace/fitpulse-app/fitpulse-expo || exit 1
export NODE_OPTIONS=--dns-result-order=ipv4first
EAS=~/workspace/tools/eas/node_modules/.bin/eas
APPID=50aeb6fe-c390-4447-b246-13a9a8408f8d

check_builds() {
  curl -s --max-time 45 -X POST https://api.expo.dev/graphql \
    -H "Content-Type: application/json" -H "Authorization: Bearer $EXPO_TOKEN" \
    -d "{\"query\":\"query(\$appId: String!, \$offset: Int!, \$limit: Int!) { app { byId(appId: \$appId) { builds(offset: \$offset, limit: \$limit) { id status } } } }\",\"variables\":{\"appId\":\"$APPID\",\"offset\":0,\"limit\":3}}" \
    | grep -o '"status":"[A-Z_]*"' | head -3
}

for i in 1 2 3 4 5 6; do
  echo "=== attempt $i $(date +%T) ==="
  CI=1 $EAS build --platform android --profile preview --non-interactive --no-wait 2>&1 | tail -6
  sleep 5
  FOUND=$(check_builds)
  echo "server builds: ${FOUND:-none}"
  if [ -n "$FOUND" ]; then echo "SUBMITTED_OK"; exit 0; fi
  sleep 10
done
echo "ALL_ATTEMPTS_FAILED"
exit 1
