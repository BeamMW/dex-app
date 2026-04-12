#!/usr/bin/env bash
set -euo pipefail

DAPP_NAME="dex-app"
MANIFEST_NAME="Beam DEX"
MANIFEST_DESCRIPTION="AMM based decentralized exchange for Confidential Assets"
MANIFEST_VERSION_PREFIX="1.1"
MANIFEST_ICON="localapp/app/logo.svg"
MANIFEST_URL="localapp/app/index.html"
MANIFEST_API_VERSION="7.3"
MANIFEST_MIN_API_VERSION="7.3"
MANIFEST_GUID="db851322f6674a6da3e84e9953db2ffd"

COMMIT_COUNT="$(git rev-list --count HEAD)"
VERSION="${MANIFEST_VERSION_PREFIX}.${COMMIT_COUNT}"

yarn install
yarn build:prod

test -f html/index.html
test -f html/index.js
test -f html/styles.css
test -f src/app/shared/icons/logo-dex.svg

rm -rf "${DAPP_NAME}" "${DAPP_NAME}.dapp"
mkdir -p "${DAPP_NAME}/app"
cp -r html/* "${DAPP_NAME}/app/"
cp src/app/shared/icons/logo-dex.svg "${DAPP_NAME}/app/logo.svg"

cat > "${DAPP_NAME}/manifest.json" <<EOF
{
  "name": "${MANIFEST_NAME}",
  "description": "${MANIFEST_DESCRIPTION}",
  "icon": "${MANIFEST_ICON}",
  "url": "${MANIFEST_URL}",
  "version": "${VERSION}",
  "api_version": "${MANIFEST_API_VERSION}",
  "min_api_version": "${MANIFEST_MIN_API_VERSION}",
  "guid": "${MANIFEST_GUID}"
}
EOF

(
  cd "${DAPP_NAME}"
  zip -r "../${DAPP_NAME}.dapp" ./*
)

echo "Created ${DAPP_NAME}.dapp with version ${VERSION}"
