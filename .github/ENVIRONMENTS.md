# 🌍 GitHub Environments 設置指南

## 當前狀態
✅ **已修復**：暫時移除了 `environment: staging` 和 `environment: production` 配置，避免 workflow 失敗

## 什麼是 GitHub Environments？

GitHub Environments 是一個功能，可以：
- 設置部署保護規則
- 需要審核才能部署
- 設置環境特定的 secrets
- 限制部署到特定分支

## 如何設置 Environments（可選）

### 1. 前往 Repository Settings
```
https://github.com/yesinyagami/night-god-tarot-unified/settings/environments
```

### 2. 創建 Environments
點擊 "New environment" 並創建：
- `staging` - 用於測試環境
- `production` - 用於生產環境

### 3. 配置保護規則（可選）
- **Required reviewers**: 需要人工審核
- **Wait timer**: 延遲部署
- **Deployment branches**: 限制可部署的分支

### 4. 重新啟用 Environment 配置
如果您設置了 environments，可以恢復這些配置：

```yaml
# Deploy to Staging
deploy-to-staging:
  name: Deploy to Staging
  runs-on: ubuntu-22.04
  needs: [build]
  if: github.ref == 'refs/heads/develop'
  environment: staging  # 重新啟用

# Deploy to Production  
deploy-to-production:
  name: Deploy to Production
  runs-on: ubuntu-22.04
  needs: [docker]
  if: github.ref == 'refs/heads/main'
  environment: production  # 重新啟用
```

## 🚀 當前建議

**暫時不設置 environments**，因為：
1. 會增加 workflow 複雜性
2. 需要額外的審核步驟
3. 當前重點是讓基本 CI/CD 流程正常工作

等到 secrets 設置完成且 workflow 正常運行後，再考慮啟用環境保護功能。