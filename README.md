# Joe Lannan Personal Website

View this website at [joe-lannan.com](https://www.joe-lannan.com)

This website was created as a fork of [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io)

## Setup and Development

### Repository Data

The Portfolio page displays GitHub repositories from both `joe-lannan` and `koinslot-inc` accounts. This data is fetched during the build process and stored as static JSON files.

To update the repository data manually:

```bash
# Run the script (without a GitHub token - may be subject to API rate limits)
./scripts/generate-repo-data.sh

# Run with a GitHub token for higher rate limits
./scripts/generate-repo-data.sh YOUR_GITHUB_TOKEN
```

The GitHub Action workflow will automatically update this data during each deployment.
