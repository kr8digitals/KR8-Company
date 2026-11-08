#!/usr/bin/env bash
# =============================================================================
# RIYA Self-Hosted Local Open-Source LLM Launcher (Zero Cloud API Dependency)
# =============================================================================
# Equips a dedicated Linux / macOS / VPS node with Ollama + quantized
# Qwen2.5-1.5B-Instruct (Q4_K_M, ~986 MB RAM) or Qwen2.5-0.5B-Instruct (~397 MB)
# and binds locally on 127.0.0.1:11434 for RIYA's grounded RAG pipeline.
#
# Usage:
#   chmod +x scripts/start-riya-local-llm.sh
#   ./scripts/start-riya-local-llm.sh
#
# Then set in .env.local (or your self-hosted environment):
#   RIYA_LOCAL_LLM_URL=http://127.0.0.1:11434
#   RIYA_LOCAL_MODEL=qwen2.5:1.5b-instruct-q4_K_M
# =============================================================================

set -euo pipefail

MODEL="${RIYA_LOCAL_MODEL:-qwen2.5:1.5b-instruct-q4_K_M}"
HOST_ADDR="${OLLAMA_HOST:-127.0.0.1:11434}"

echo "[RIYA Local Inference] Checking available RAM..."
FREE_MB=$(free -m 2>/dev/null | awk '/^Mem:/ {print $7}' || echo "2048")
if [ "$FREE_MB" -lt 1100 ] && [ "$MODEL" = "qwen2.5:1.5b-instruct-q4_K_M" ]; then
  echo "[RIYA Local Inference] Low available RAM (${FREE_MB} MB) — selecting compact quantized qwen2.5:0.5b-instruct-q4_K_M"
  MODEL="qwen2.5:0.5b"
fi

if ! command -v ollama >/dev/null 2>&1; then
  echo "[RIYA Local Inference] Installing Ollama local inference runtime..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

export OLLAMA_HOST="$HOST_ADDR"
if ! curl -fsS "http://${HOST_ADDR}/api/tags" >/dev/null 2>&1; then
  echo "[RIYA Local Inference] Starting local Ollama daemon at ${HOST_ADDR}..."
  nohup ollama serve >/tmp/riya-ollama.log 2>&1 &
  sleep 3
fi

echo "[RIYA Local Inference] Pulling quantized open-source model: ${MODEL}"
ollama pull "$MODEL"

echo "[RIYA Local Inference] Ready! Configure .env.local with:"
echo "  RIYA_LOCAL_LLM_URL=http://${HOST_ADDR}"
echo "  RIYA_LOCAL_MODEL=${MODEL}"
