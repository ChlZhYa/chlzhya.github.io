#!/bin/bash
# Journey Scholar GitHub Pages 部署脚本
set -e

REPO="ChlZhYa/chlzhya.github.io"
echo "=== Journey Scholar 部署到 GitHub Pages ==="

# Check auth
if ! gh auth status &>/dev/null; then
    echo "❌ GitHub 未认证，请先运行: gh auth login"
    exit 1
fi

echo "✓ GitHub 认证正常"

# Navigate to site directory
cd "$(dirname "$0")"

# Build fresh commit
git add -A
git commit -m "deploy: Journey Scholar $(date +%Y-%m-%d_%H:%M)" || echo "Nothing to commit"

# Push
echo "Pushing to $REPO..."
git push origin main

echo ""
echo "✅ 部署完成！"
echo "   站点地址: https://chlzhya.github.io"
echo "   (GitHub Pages 会自动构建，1-2分钟后生效)"
