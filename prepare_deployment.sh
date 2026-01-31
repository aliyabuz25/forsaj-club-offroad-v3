#!/bin/bash
# Prepare deployment zip based on instructions

APP_NAME="forsaj-club-offroad-v3"
ZIP_NAME="${APP_NAME}.zip"

echo "Cleaning up..."
rm -rf dist
find . -name '.DS_Store' -type f -delete
find . -name '._*' -type f -delete
find . -name '__MACOSX' -type d -exec rm -rf {} +

echo "Zipping..."
zip -rX "$ZIP_NAME" . -x "node_modules/*" -x "uploads/*" -x ".git/*" -x "*.zip" -x "nginx-logs/*"

echo "Done! created $ZIP_NAME"
echo "Follow instructions:"
echo "1. Upload $ZIP_NAME to /datastore/$APP_NAME/"
echo "2. Unzip to /datastore/$APP_NAME/app"
echo "3. Run docker build commands"
echo "4. Deploy docker-compose.deploy.yml in Portainer"
