#!/usr/bin/env bash
# =============================================================================
# Mirror RIYA's 10 Open-Source AI/NLP Repositories + Push KR8-Company to GitHub
# Usage: GITHUB_TOKEN=ghp_xxx GITHUB_ORG=kr8digitals bash scripts/mirror-oss-to-github.sh
# =============================================================================
set -euo pipefail

GITHUB_ORG="${GITHUB_ORG:-kr8digitals}"
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Set GITHUB_TOKEN=<your_github_pat> to push KR8-Company and mirror all 10 open-source RIYA repositories to github.com/${GITHUB_ORG}."
  exit 1
fi

REPOS=(
  "https://github.com/axa-group/nlp.js.git|riya-oss-nlpjs"
  "https://github.com/lucaong/minisearch.git|riya-oss-minisearch"
  "https://github.com/askorama/orama.git|riya-oss-orama"
  "https://github.com/spencermountain/compromise.git|riya-oss-compromise"
  "https://github.com/krisk/Fuse.git|riya-oss-fuse"
  "https://github.com/winkjs/wink-bm25-text-search.git|riya-oss-wink-bm25"
  "https://github.com/winkjs/wink-sentiment.git|riya-oss-wink-sentiment"
  "https://github.com/winkjs/wink-porter2-stemmer.git|riya-oss-wink-stemmer"
  "https://github.com/words/double-metaphone.git|riya-oss-double-metaphone"
  "https://github.com/shivenspancholi-dev/RAG-AI-Chatbot.git|riya-oss-hybrid-rag"
)

WORK="/tmp/riya-github-mirror-$$"
mkdir -p "$WORK"

for entry in "${REPOS[@]}"; do
  UPSTREAM="${entry%%|*}"
  TARGET_NAME="${entry##*|}"
  echo ">>> Ensuring repository ${GITHUB_ORG}/${TARGET_NAME} exists..."
  curl -sS -X POST "https://api.github.com/orgs/${GITHUB_ORG}/repos" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -d "{\"name\":\"${TARGET_NAME}\",\"private\":false,\"description\":\"Open-source engine powering RIYA on KR8 DIGITALS\"}" >/dev/null || \
  curl -sS -X POST "https://api.github.com/user/repos" \
    -H "Authorization: Bearer ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -d "{\"name\":\"${TARGET_NAME}\",\"private\":false,\"description\":\"Open-source engine powering RIYA on KR8 DIGITALS\"}" >/dev/null || true

  git clone --depth 1 "$UPSTREAM" "$WORK/$TARGET_NAME"
  pushd "$WORK/$TARGET_NAME" >/dev/null
  git remote set-url origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_ORG}/${TARGET_NAME}.git"
  git push --force origin HEAD:main
  popd >/dev/null
done

rm -rf "$WORK"
echo "All 10 RIYA open-source engines mirrored to https://github.com/${GITHUB_ORG}!"
