# 🔐 GitHub Secrets 設置指南

## ❗ 重要：必須立即設置這些 secrets

您的 GitHub Actions 目前失敗的主要原因是**缺少必要的 secrets**。

### 📍 設置步驟

1. **前往 GitHub Secrets 設置頁面**：
   ```
   https://github.com/yesinyagami/night-god-tarot-unified/settings/secrets/actions
   ```

2. **點擊 "New repository secret"**

3. **按順序新增以下 secrets**：

## 📝 必要的 Secrets

### 1. MONICA_API_KEY
- **Name**: `MONICA_API_KEY`
- **Value**: `your_monica_api_key_here`
- **說明**: Monica AI API 密鑰（請替換為您的實際 API key）

### 2. JWT_SECRET
- **Name**: `JWT_SECRET`
- **Value**: `9c156c7efd34c10ba85c63e5aff1a6bbccd6fac4b38ae1eeeb78ea19b48ddd5e`
- **說明**: JWT token 簽名密鑰

### 3. DB_PASSWORD
- **Name**: `DB_PASSWORD`
- **Value**: `f631bfb55a0b7f6a0cd93cc1d2974a22`
- **說明**: 資料庫密碼

### 4. REDIS_PASSWORD
- **Name**: `REDIS_PASSWORD`
- **Value**: `480d7956aa95fb134b9a208d052dc7bc`
- **說明**: Redis 密碼

### 5. CODECOV_TOKEN (可選)
- **Name**: `CODECOV_TOKEN`
- **Value**: `your_codecov_token_here`
- **說明**: 代碼覆蓋率報告 token（可選）

## ✅ 設置完成後

設置完所有 secrets 後，GitHub Actions 應該會：
1. 自動重新運行失敗的 workflow
2. 通過大部分檢查步驟
3. 顯示綠色的成功狀態

## 🔍 當前狀態

- ❌ **Secrets 數量**: 0/5 已設置 ⚠️ **立即需要設置**
- ❌ **CI/CD 狀態**: 失敗 (缺少 secrets)
- ✅ **VS Code 擴展**: GitHub Actions v0.27.2 已安裝  
- ✅ **Workflow 修復**: 所有版本兼容性問題已解決

## 📊 驗證腳本

執行 `node scripts/check-secrets-status.js` 可檢查設置狀態

## 🚀 測試步驟

設置完 secrets 後：
1. 前往 [Actions 頁面](https://github.com/yesinyagami/night-god-tarot-unified/actions)
2. 找到最新的失敗 workflow
3. 點擊 "Re-run all jobs" 重新執行
4. 觀察是否變為綠色成功狀態