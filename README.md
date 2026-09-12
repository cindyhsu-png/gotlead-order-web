# 限定優惠下單頁

從 [`ai-xplore-web`](https://github.com/cindyhsu-png/ai-xplore-web) 的設計語彙改版而來的**下單頁**，賣的是 99agent 這頁的兩個方案：

<https://all.99agent.app/plangotlead5?code=VWJE0619D_2DWD_2&src=qr>

純靜態單檔（`index.html`），走 GitHub Pages，之後可整頁 iframe 嵌入 Kolable。

## 這站做什麼、不做什麼

| | |
|---|---|
| 做 | 說服、比價、合購算式、課綱、埋點、把人帶到結帳 |
| **不做** | 金流、發票、訂單紀錄 |

## 結帳落點（兩選一）

改 `plans.js` 的 `checkout.provider` 一行，全站按鈕跟著換。

### A. `'99agent'` — 目前生效

導到 `all.99agent.app/plangotlead5?code=<存取碼>&src=<來源>&plan=<方案代碼>`。
一個方案一顆按鈕，帶得動 promotion code。

### B. `'kolable'` — 已接好，尚未啟用

導到 dnschool（數位遊牧學院）的專案頁 `dnschool.kolable.app/projects/9737162e-…`。

| | |
|---|---|
| 專案 | `9737162e-8778-4b6f-af82-76ad0ac5fe5e`「AI 獲客副業實戰」 |
| 方案 1 | `bf19c120-362f-45a6-a1b3-aa27c02490c6` AI 獲客副業實戰 |
| 方案 2 | `5e4c71ea-0564-4976-9066-f54eb0fe1e23` 行銷大師 24 大模組 |

> ⚠️ **Kolable 沒有「一鍵直達某方案」的網址參數。** 查過前台 route table，購物車只有無參數的 `/cart`，bundle 裡也沒有 `projectPlanId` / `visitIntro` 這類 query param。所以兩顆按鈕只能導到同一個專案頁，使用者到那邊自己挑方案 → 加入購物車 → 結帳。就算有參數也沒用——我們在不同網域，寫不進對方的購物車 localStorage。

`checkout.kolable.sharingCode` 是 Kolable 的推廣碼欄位，要做代銷分潤時填這裡。

### 切換前 Kolable 端要先處理

1. **專案未發布**（`published_at` 是 null）→ 公開頁現在打不開，按鈕會是死連結
2. **兩個方案都設成訂閱制**（`is_subscription: true`，週期 1 年）→ 跟本頁「一次付清」的文案衝突
3. **行銷大師原價是 960,000**，多一個 0（應為 96,000）
4. **`sold_at` 是 2026-09-12 17:00（台北）** → 販售截止時間，過了就買不到

## 商品資料

| 方案 | 代碼 | 原價 | 優惠價 | 當加購品 |
|---|---|---|---|---|
| AI 獲客副業實戰 | `LIVE_VIBE_38000_PLANHUBER_PLANHUBER2` | 126,000 | **32,000** | 14,000 |
| 行銷大師 24 大模組 | `LIVE_MASTER_48000_N8N2_2_PLANHUBER2_3` | 96,000 | **48,000** | 30,000 |

合購 = 主方案優惠價 + 另一案加購價 = **62,000**（哪一案當主方案結果都一樣）。

## 頁面結構

| 區塊 | 內容 | 來源 |
|---|---|---|
| hero | 「選擇今晚要保留的方案」、倒數（可關） | 自製 |
| `#plans` | 兩張方案卡 + 合購區 | 自製 |
| `#outline` | **12 大課綱**：12 張單元卡（含各單元產出）+ 四段旅程 | 原為 PNG，改寫成原生卡片 |
| `#why` | 三個陷阱：數位垃圾／一鍵變現幻想／單點工具 | 搬自 ai-xplore-web |
| `#pipeline` | 四步產線 × 成效儀表板 | 搬自 ai-xplore-web |
| `#works` | 26 支 UGC 影片 + 50 張廣告圖輪播，點開放大 | 搬自 ai-xplore-web |

先出價、再補說服材料。手機上另有底部固定下單列（捲過 420px 後滑出）。

**沒有頁首導覽列、沒有 FAQ、沒有頁尾**——這頁只有一條路：往下看、然後下單。
`plans.js` 裡的 `faq[]` 與 `company` 保留著沒刪，之後想加回來只要把區塊接上就好。

> 12 大課綱原本是一張寬版 PNG，手機上讀不了、字也選不起來，所以改成 `curriculum.units` 驅動的卡片。要改課綱內容動 `plans.js` 就好，不必重做圖。

## 改內容

全部集中在 [`assets/plans.js`](assets/plans.js)，`index.html` 不必動：

- `checkout.accessCode` — 換活動頁就換這個
- `checkout.source` — 來源標記，分流量用（`qr` / `fb` / `line` / `edm`…）
- `copy.deadline` — 填 ISO 時間（例 `2026-09-30T23:59:59+08:00`）就會出現倒數；留空則整塊隱藏
- `plans[]` — 名稱、副標、封面、`original` / `pay` / `addonPay`、賣點列、`tone`（`blue` / `gold`）
- `bundle` — `enabled: false` 可整塊關掉
- `curriculum` — 12 大課綱：`units[]`（標題 `t` / 副標 `s` / 產出 `o[]`）、`journey[]`、`belongsTo`（課綱屬於哪個方案）；`enabled: false` 可整塊關掉
- `faq[]` / `company`

> 🔴 價格改了要同步改 99agent 後台，否則頁面寫的和結帳金額會對不上。

## 購物車按鈕落點

頁面預留了 `.cta-slot`，外部元件掛進去後預設按鈕會自動隱藏：

| `data-cta` | 位置 |
|---|---|
| `plan:<方案代碼>` | 各方案卡底部 |
| `bundle` | 合購區 |
| `sticky` | 行動版底部下單列 |

```js
OrderPage.slots();                    // 列出所有落點
OrderPage.checkoutURL(planCode);      // 取得該方案的結帳網址
OrderPage.mountCTA('bundle', myBtn);  // 掛自己的按鈕
```

## 埋點

`assets/analytics.js` 與 nova / nschool / xlab / ai-xplore 共用同一份。
點下單會送 `checkout_click`（帶 `plan` 與 `href`）。沒填 GA ID 也能驗：開 console 看 `window.__mojiEvents`。

## 部署

推 `main` 就自動由 `.github/workflows/deploy.yml` 發佈到 GitHub Pages。
