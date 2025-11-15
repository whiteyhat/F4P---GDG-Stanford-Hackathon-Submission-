
export const sections = [
  { id: 'initial-setup', title: '1. Initial Setup & Prerequisites' },
  { id: 'configure-secrets', title: '2. Create Secrets in Secret Manager' },
  { id: 'project-structure', title: '3. Project Structure' },
  { id: 'project-files', title: '4. Create Project Files' },
  { id: 'build-push-image', title: '5. Build & Push Docker Image' },
  { id: 'deploy-cloud-run', title: '6. Deploy to Cloud Run' },
  { id: 'post-deployment', title: '7. Post-Deployment Verification' },
  { id: 'troubleshooting', title: '8. Troubleshooting' },
  { id: 'production-readiness', title: '9. Production Readiness Checklist' },
];

export const dockerfileContent = `
# Stage 1: Build Stage
FROM node:20-bullseye-slim AS builder

# Install build dependencies including Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \\
    ca-certificates \\
    dumb-init \\
    fonts-liberation \\
    libasound2 \\
    libatk-bridge2.0-0 \\
    libatk1.0-0 \\
    libc6 \\
    libcairo2 \\
    libcups2 \\
    libdbus-1-3 \\
    libexpat1 \\
    libfontconfig1 \\
    libgbm1 \\
    libgcc1 \\
    libglib2.0-0 \\
    libgtk-3-0 \\
    libnspr4 \\
    libnss3 \\
    libpango-1.0-0 \\
    libpangocairo-1.0-0 \\
    libstdc++6 \\
    libx11-6 \\
    libx11-xcb1 \\
    libxcb1 \\
    libxcomposite1 \\
    libxcursor1 \\
    libxdamage1 \\
    libxext6 \\
    libxfixes3 \\
    libxi6 \\
    libxrandr2 \\
    libxrender1 \\
    libxss1 \\
    libxtst6 \\
    lsb-release \\
    procps \\
    wget \\
    xdg-utils \\
  && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy all application files
COPY . .

# Install dependencies for all workspaces
WORKDIR /app/agent
RUN pnpm install --frozen-lockfile

# Build the Mastra agent
RUN npx mastra build --dir src

# Stage 2: Production Stage
FROM node:20-bullseye-slim AS production

# Install production dependencies including Chromium
RUN apt-get update && apt-get install -y --no-install-recommends \\
    ca-certificates \\
    dumb-init \\
    fonts-liberation \\
    libasound2 \\
    libatk-bridge2.0-0 \\
    libatk1.0-0 \\
    libc6 \\
    libcairo2 \\
    libcups2 \\
    libdbus-1-3 \\
    libexpat1 \\
    libfontconfig1 \\
    libgbm1 \\
    libgcc1 \\
    libglib2.0-0 \\
    libgtk-3-0 \\
    libnspr4 \\
    libnss3 \\
    libpango-1.0-0 \\
    libpangocairo-1.0-0 \\
    libstdc++6 \\
    libx11-6 \\
    libx11-xcb1 \\
    libxcb1 \\
    libxcomposite1 \\
    libxcursor1 \\
    libxdamage1 \\
    libxext6 \\
    libxfixes3 \\
    libxi6 \\
    libxrandr2 \\
    libxrender1 \\
    libxss1 \\
    libxtst6 \\
    lsb-release \\
    procps \\
    wget \\
    xdg-utils \\
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=4111

WORKDIR /app

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app .

# Set final working directory to the Mastra output
WORKDIR /app/agent/.mastra/output

EXPOSE 4111

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \\
  CMD wget -q --spider http://localhost:4111/health || exit 1

# Start the application
# Mastra dev is run for 30s to ensure playground files are generated, then the main app starts.
CMD ["/bin/sh", "-c", "cd /app/agent && (timeout 30s npx mastra dev --dir src || true) && cd /app/agent/.mastra/output && node index.mjs"]
`;

export const cloudrunServiceYamlContent = `
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dory-x402-agent
  annotations:
    run.googleapis.com/launch-stage: BETA
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/cpu-throttling: "false" # Keep CPU always allocated
    spec:
      serviceAccountName: dory-x402-agent-sa@PROJECT_ID.iam.gserviceaccount.com
      containerConcurrency: 80
      timeoutSeconds: 3600 # 1 hour
      containers:
        - image: REGION-docker.pkg.dev/PROJECT_ID/dory-x402/agent:latest
          ports:
            - name: http1
              containerPort: 4111
          env:
            - name: PAYWALL_URL
              value: "https://your-paywall.workers.dev" # IMPORTANT: Update this URL
            - name: SOLANA_RPC_URL
              value: "https://api.devnet.solana.com"
            - name: GAME_MCP_SERVER_PATH
              value: "/app/mcp/server.js"
            - name: UBER_EATS_MCP_SERVER_PATH
              value: "/app/mcp-uber-eats/server.js"
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "4111"
            # Secrets will be mounted as environment variables
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: openai-api-key
                  key: latest
            - name: GOOGLE_GENERATIVE_AI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: google-generative-ai-api-key
                  key: latest
            - name: AGENT_PRIVATE_KEY
              valueFrom:
                secretKeyRef:
                  name: agent-private-key
                  key: latest
            - name: BROWSER_USE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: browser-use-api-key
                  key: latest
            - name: BROWSER_USE_PROFILE_ID
              valueFrom:
                secretKeyRef:
                  name: browser-use-profile-id
                  key: latest
          resources:
            limits:
              cpu: "2"
              memory: 4Gi
            requests:
              cpu: "1"
              memory: 2Gi
          startupProbe:
            timeoutSeconds: 240
            periodSeconds: 240
            failureThreshold: 1
            tcpSocket:
              port: 4111
          livenessProbe:
            httpGet:
              path: /health
              port: 4111
            initialDelaySeconds: 30
  traffic:
    - percent: 100
      latestRevision: true
`;

export const deployShContent = `
#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# --- Configuration ---
# Set your GCP Project ID and Region.
# It's recommended to set these as environment variables before running the script.
if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID environment variable is not set."
    exit 1
fi
if [ -z "$REGION" ]; then
    echo "Error: REGION environment variable is not set."
    exit 1
fi

SERVICE_NAME="dory-x402-agent"
SERVICE_ACCOUNT_NAME="dory-x402-agent-sa"
REPO_NAME="dory-x402"
IMAGE_NAME="agent"
YAML_TEMPLATE="cloudrun-service.yaml"
YAML_DEPLOY="cloudrun-service-deploy.yaml"

# --- Check Prerequisites ---
echo "Checking for required tools..."
command -v gcloud >/dev/null 2>&1 || { echo >&2 "gcloud CLI not found. Please install it. Aborting."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo >&2 "Docker not found. Please install it. Aborting."; exit 1; }
echo "Tools found."

# --- Enable GCP APIs ---
echo "Enabling required GCP APIs..."
gcloud services enable \\
  run.googleapis.com \\
  artifactregistry.googleapis.com \\
  secretmanager.googleapis.com \\
  iam.googleapis.com \\
  cloudbuild.googleapis.com --project=$PROJECT_ID

# --- Create Artifact Registry Repository ---
echo "Setting up Artifact Registry..."
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION --project=$PROJECT_ID &>/dev/null; then
  echo "Creating Artifact Registry repository '$REPO_NAME'..."
  gcloud artifacts repositories create $REPO_NAME \\
    --repository-format=docker \\
    --location=$REGION \\
    --project=$PROJECT_ID
else
  echo "Artifact Registry repository '$REPO_NAME' already exists."
fi

# --- Configure Docker Authentication ---
echo "Configuring Docker authentication..."
gcloud auth configure-docker \${REGION}-docker.pkg.dev --project=$PROJECT_ID

# --- Build and Push Docker Image ---
echo "Building and pushing Docker image..."
IMAGE_LATEST="\${REGION}-docker.pkg.dev/\${PROJECT_ID}/\${REPO_NAME}/\${IMAGE_NAME}:latest"
IMAGE_TIMESTAMPED="\${REGION}-docker.pkg.dev/\${PROJECT_ID}/\${REPO_NAME}/\${IMAGE_NAME}:$(date +%Y%m%d-%H%M%S)"

docker build -t $IMAGE_LATEST -t $IMAGE_TIMESTAMPED .
docker push $IMAGE_LATEST
docker push $IMAGE_TIMESTAMPED

# --- Create Service Account and Grant Permissions ---
echo "Setting up IAM Service Account..."
SA_EMAIL="\${SERVICE_ACCOUNT_NAME}@\${PROJECT_ID}.iam.gserviceaccount.com"
if ! gcloud iam service-accounts describe $SA_EMAIL --project=$PROJECT_ID &>/dev/null; then
  echo "Creating service account '$SERVICE_ACCOUNT_NAME'..."
  gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \\
    --display-name="Dory X402 Agent Service Account" \\
    --project=$PROJECT_ID
else
  echo "Service account '$SERVICE_ACCOUNT_NAME' already exists."
fi

echo "Granting Secret Manager Accessor role to the service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \\
    --member="serviceAccount:$SA_EMAIL" \\
    --role="roles/secretmanager.secretAccessor" \\
    --condition=None >/dev/null # Suppress verbose output

# --- Prepare and Deploy to Cloud Run ---
echo "Preparing deployment configuration..."
# Replace placeholders in the YAML file
sed -e "s/PROJECT_ID/$PROJECT_ID/g" -e "s/REGION/$REGION/g" "$YAML_TEMPLATE" > "$YAML_DEPLOY"

echo "Deploying service '$SERVICE_NAME' to Cloud Run..."
gcloud run services replace "$YAML_DEPLOY" \\
  --platform=managed \\
  --region=$REGION \\
  --project=$PROJECT_ID

# --- Make Service Publicly Accessible ---
echo "Configuring public access (IAM)..."
gcloud run services add-iam-policy-binding $SERVICE_NAME \\
  --region=$REGION \\
  --member="allUsers" \\
  --role="roles/run.invoker" \\
  --project=$PROJECT_ID >/dev/null # Suppress verbose output

# --- Clean up temporary file ---
rm "$YAML_DEPLOY"

# --- Output Service URL ---
echo "Deployment successful!"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform=managed --region=$REGION --format='value(status.url)' --project=$PROJECT_ID)
echo "----------------------------------------------------"
echo "Service URL: $SERVICE_URL"
echo "----------------------------------------------------"
`;

export const checklistItems = [
  { id: 'secrets', label: 'All secrets created in Secret Manager' },
  { id: 'paywall', label: 'PAYWALL_URL points to the production Cloudflare Worker' },
  { id: 'solana', label: 'Solana RPC URL is set for the target environment (e.g., mainnet-beta)' },
  { id: 'domain', label: 'Custom domain configured for the service (optional)' },
  { id: 'monitoring', label: 'Monitoring and alerting rules are set up in Cloud Monitoring' },
  { id: 'budget', label: 'Cost budget alerts are configured for the GCP project' },
  { id: 'backup', label: 'A secure backup strategy is in place for the wallet private key' },
];

export const troubleshootingItems = [
    {
        issue: "Mastra Studio shows landing page instead of playground",
        solution: "This can happen if the initial `npx mastra dev` command in the container's CMD fails or times out before generating the necessary playground files. Check the container startup logs for any errors related to this command. The 30-second timeout is designed to prevent it from hanging, but on a slow cold start, it might not be enough. The final `node index.mjs` command relies on these files existing."
    },
    {
        issue: "Container fails with 'PAYWALL_URL is not set'",
        solution: "This is a configuration error. Ensure the `PAYWALL_URL` environment variable is correctly set in your `cloudrun-service.yaml` file. You must replace the default placeholder value (`https://your-paywall.workers.dev`) with your actual Cloudflare Worker URL. Also, verify that all other environment variables and secrets are correctly mapped."
    },
    {
        issue: "MCP services (Game/Uber Eats) are not working",
        solution: "First, check the Cloud Run logs for any errors related to the MCP server paths. Filter logs using a query like `textPayload:\"mcp\"`. Second, verify that the `GAME_MCP_SERVER_PATH` and `UBER_EATS_MCP_SERVER_PATH` environment variables in `cloudrun-service.yaml` are set to the exact absolute paths inside the container: `/app/mcp/server.js` and `/app/mcp-uber-eats/server.js`."
    },
    {
        issue: "Out of memory errors or Chromium crashes",
        solution: "Browser automation with Chromium is memory-intensive. The service is configured with a 4Gi memory limit. If you're seeing OOM errors, especially during complex automation tasks, you may need to increase this limit. Edit the `cloudrun-service.yaml` file and change `memory: 4Gi` to `memory: 8Gi` under the `limits` section. Remember to also adjust the `requests` value accordingly."
    },
    {
        issue: "Deployment fails with permission denied errors",
        solution: "Permission errors during deployment usually point to IAM issues. Ensure the service account (`dory-x402-agent-sa`) has the `roles/secretmanager.secretAccessor` role. Also, ensure that the user or service account running the `deploy.sh` script has sufficient permissions, such as `roles/run.admin`, `roles/iam.serviceAccountUser`, and `roles/artifactregistry.writer`."
    },
    {
        issue: "Health checks are failing",
        solution: "The container might be failing to start or the application inside is not responding on port 4111. Check the logs for startup errors. The health check expects a 200 OK response from the `/health` endpoint. Ensure your Mastra application correctly exposes this endpoint and starts without errors."
    }
];
