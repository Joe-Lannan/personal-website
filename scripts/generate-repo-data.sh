#!/bin/bash
# Script to generate repository data locally
# Usage: ./scripts/generate-repo-data.sh [github_token]

set -e

# Create data directory if it doesn't exist
mkdir -p assets/data

# Check if GitHub token was provided
if [ -n "$1" ]; then
  TOKEN_HEADER="Authorization: token $1"
  echo "Using provided GitHub token"
else
  TOKEN_HEADER=""
  echo "Warning: No GitHub token provided. Rate limits may apply."
fi

# Define the accounts to fetch
ACCOUNTS=("joe-lannan" "koinslot-inc")

# Fetch repositories for each account
for account in "${ACCOUNTS[@]}"; do
  echo "Fetching repositories for $account..."
  
  # Build the curl command
  CURL_COMMAND="curl -s"
  if [ -n "$TOKEN_HEADER" ]; then
    CURL_COMMAND="$CURL_COMMAND -H \"$TOKEN_HEADER\""
  fi
  CURL_COMMAND="$CURL_COMMAND -H \"Accept: application/vnd.github.v3+json\""
  CURL_COMMAND="$CURL_COMMAND \"https://api.github.com/users/$account/repos?sort=size&direction=desc&per_page=100\""
  
  # Execute and save to file
  eval $CURL_COMMAND > "assets/data/$account-repos.json"
  
  # Check if result contains error message
  if grep -q "\"message\":" "assets/data/$account-repos.json"; then
    echo "Error fetching repositories for $account:"
    cat "assets/data/$account-repos.json"
    echo ""
    # Create empty array as fallback
    echo "[]" > "assets/data/$account-repos.json"
  else
    repo_count=$(grep -o "\"name\":" "assets/data/$account-repos.json" | wc -l)
    echo "Successfully fetched $repo_count repositories for $account"
  fi
done

# Check if jq is installed
if command -v jq &> /dev/null; then
  echo "Combining repository data..."
  jq -s 'add | sort_by(.size) | reverse' assets/data/*-repos.json > assets/data/github-repos.json
  echo "Creating timestamp file..."
  echo "{\"updated_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}" > assets/data/repos-updated.json
else
  echo "Warning: jq command not found. Using fallback method to combine repositories."
  echo "[" > assets/data/github-repos.json
  cat assets/data/joe-lannan-repos.json | sed -e 's/\[//' -e 's/\]/,/' >> assets/data/github-repos.json
  cat assets/data/koinslot-inc-repos.json | sed -e 's/\[//' -e 's/\]//' >> assets/data/github-repos.json
  echo "]" >> assets/data/github-repos.json
  # Create timestamp
  echo "{\"updated_at\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}" > assets/data/repos-updated.json
fi

echo "Repository data generated successfully!"
echo "Files saved to: assets/data/github-repos.json and assets/data/repos-updated.json"