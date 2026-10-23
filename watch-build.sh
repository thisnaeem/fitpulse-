#!/bin/bash
# Poll EAS build status until it finishes; print final JSON.
APPID=50aeb6fe-c390-4447-b246-13a9a8408f8d
BID=169ff339-43e6-4493-8c90-c6e07b3cdc48
for i in $(seq 1 40); do
  RES=$(curl -s --max-time 45 -X POST https://api.expo.dev/graphql \
    -H "Content-Type: application/json" -H "Authorization: Bearer $EXPO_TOKEN" \
    -d "{\"query\":\"query(\$appId: String!, \$offset: Int!, \$limit: Int!) { app { byId(appId: \$appId) { builds(offset: \$offset, limit: \$limit) { id status artifacts { applicationArchiveUrl } error { errorCode message } } } } }\",\"variables\":{\"appId\":\"$APPID\",\"offset\":0,\"limit\":3}}")
  ST=$(echo "$RES" | grep -o '"status":"[A-Z_]*"' | head -1)
  echo "$(date +%T) poll $i: $ST"
  case "$ST" in
    *FINISHED*|*ERRORED*|*CANCELED*)
      echo "FINAL: $RES"
      exit 0
      ;;
  esac
  sleep 90
done
echo "TIMEOUT_WAITING"
