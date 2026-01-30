FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

# Install Python and dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    python3.11 \
    python3-pip \
    python3-venv \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Configure git (optional, for better experience)
RUN git config --global core.autocrlf input

# Install global npm packages
RUN npm install -g pnpm typescript @types/node

USER node
