#!/bin/bash
# ====================================================================
# 🚀 Google Cloud Run Automation Deployment Script
# Packages and deploys "Cloudmon: Retrofit the 90s" using Cloud Build.
# ====================================================================
set -euo pipefail

# Ensure we are running from the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."
echo "📁 Changed directory context to project root: $(pwd)"

# Configurations
PROJECT_ID="ce-hackathon-500518"
REGION="us-central1"
SERVICE_NAME="cloudmon-game"
REPO_NAME="cloudmon-repo"
IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

echo "===================================================================="
echo "🎯 Starting Cloud Run Deployment for: ${SERVICE_NAME}"
echo "===================================================================="

# Set target project
echo "⚙️ Setting active gcloud project to ${PROJECT_ID}..."
gcloud config set project "${PROJECT_ID}"

echo "===================================================================="
echo "🔑 STEP 1: Enabling Required Google Cloud APIs..."
echo "===================================================================="
gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  run.googleapis.com

echo "✅ APIs successfully enabled."

echo "===================================================================="
echo "📦 STEP 2: Setting up Artifact Registry Repository..."
echo "===================================================================="
if gcloud artifacts repositories describe "${REPO_NAME}" --location="${REGION}" &>/dev/null; then
  echo "✅ Artifact Registry Repository '${REPO_NAME}' already exists."
else
  echo "🔧 Creating Artifact Registry Repository '${REPO_NAME}'..."
  gcloud artifacts repositories create "${REPO_NAME}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Secure repository for Cloudmon RPG assets"
  echo "✅ Repository successfully created."
fi

echo "===================================================================="
echo "🏗️ STEP 3: Submitting Build to Google Cloud Build..."
echo "===================================================================="
echo "Submitting compilation assets. Cloud Build is packaging the Nginx container..."
gcloud builds submit --tag "${IMAGE_PATH}"

echo "✅ Container successfully built and stored in Artifact Registry."

echo "===================================================================="
echo "🚀 STEP 4: Deploying to Google Cloud Run (Public Endpoint)..."
echo "===================================================================="
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_PATH}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated

echo "===================================================================="
echo "🎉 SUCCESS: Deployment Complete!"
echo "===================================================================="
echo "Your game has been retrofitted and is publicly operational!"
echo "You can access and play the game at the URL listed above."
echo "===================================================================="
