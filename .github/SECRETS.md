# GitHub Secrets 配置指南

此專案的 CI/CD pipeline 需要配置以下 GitHub Secrets。

## 必需的 Secrets

### 1. API 服務相關
- **`MONICA_API_KEY`** - Monica AI API 金鑰
  - 用途：AI 塔羅解讀服務
  - 獲取方式：從 [Monica.im](https://openapi.monica.im/) 註冊獲取

### 2. 資料庫相關
- **`DB_PASSWORD`** - 資料庫密碼
  - 用途：生產環境資料庫連接
  - 格式：字串

- **`REDIS_PASSWORD`** - Redis 快取密碼
  - 用途：生產環境 Redis 連接
  - 格式：字串

### 3. 程式碼品質相關
- **`CODECOV_TOKEN`** - Codecov 程式碼覆蓋率報告
  - 用途：上傳測試覆蓋率報告
  - 獲取方式：從 [Codecov.io](https://codecov.io/) 專案設定頁面

### 4. 通知相關（可選）
- **`NOTIFICATION_WEBHOOK`** - 失敗通知 Webhook URL
  - 用途：當 CI/CD 失敗時發送通知
  - 格式：Discord/Slack webhook URL

## 自動提供的 Secrets

以下 secrets 由 GitHub 自動提供，無需手動配置：

- `GITHUB_TOKEN` - GitHub Actions 權限令牌

## 配置步驟

1. 進入你的 GitHub 存储庫
2. 點擊 "Settings" 標籤
3. 在左側選單中點擊 "Secrets and variables" > "Actions"
4. 點擊 "New repository secret"
5. 輸入 secret 名稱和值
6. 點擊 "Add secret"

## 環境配置

### Staging 環境
需要配置：
- `MONICA_API_KEY`
- `DB_PASSWORD`

### Production 環境
需要配置：
- `MONICA_API_KEY`
- `DB_PASSWORD`
- `REDIS_PASSWORD`

## 安全注意事項

- 🔒 絕不在程式碼中硬編碼 API 金鑰或密碼
- 🔄 定期輪換 API 金鑰和密碼
- 👥 限制對 secrets 的存取權限
- 🚨 如果懷疑 secret 洩露，立即撤銷並重新生成

## 故障排除

如果 CI/CD pipeline 因為 secrets 配置失敗：

1. 檢查 Actions 標籤中的錯誤訊息
2. 確認所有必需的 secrets 都已配置
3. 驗證 secret 值的格式是否正確
4. 檢查 secret 名稱是否與 workflow 文件中的完全匹配

## 聯絡資訊

如有配置問題，請檢查：
- GitHub Actions logs
- 專案 Issues 頁面