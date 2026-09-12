# 限定優惠下單頁

從 [`ai-xplore-web`](https://github.com/cindyhsu-png/ai-xplore-web) 的設計語彙改版而來的**下單頁**，賣的是 99agent 這頁的兩個方案：

<https://all.99agent.app/plangotlead5?code=VWJE0619D_2DWD_2&src=qr>

純靜態單檔（`index.html`），走 GitHub Pages，之後可整頁 iframe 嵌入 Kolable。

## 這站做什麼、不做什麼

| | |
|---|---|
| 做 | 說服、比價、合購算式、FAQ、埋點、把人帶到結帳頁 |
| **不做** | 金流、發票、訂單紀錄 —— 這三件仍然由 99agent 處理 |

下單按鈕會組出 `https://all.99agent.app/plangotlead5?code=<存取碼>&src=<來源>&plan=<方案代碼>` 並開新分頁。
`plan` 參數目前 99agent 端不一定會吃，留著是為了之後對方支援「直接停在某個方案」時不用再改前端。

## 商品資料

| 方案 | 代碼 | 原價 | 優惠價 | 當加購品 |
|---|---|---|---|---|
| AI 獲課副業實戰 | `LIVE_VIBE_38000_PLANHUBER_PLANHUBER2` | 126,000 | **32,000** | 14,000 |
| 行銷大師 24 大模組 | `LIVE_MASTER_48000_N8N2_2_PLANHUBER2_3` | 96,000 | **48,000** | 30,000 |

合購 = 主方案優惠價 + 另一案加購價 = **62,000**（哪一案當主方案結果都一樣）。

## 改內容

全部集中在 [`assets/plans.js`](assets/plans.js)，`index.html` 不必動：

- `checkout.accessCode` — 換活動頁就換這個
- `checkout.source` — 來源標記，分流量用（`qr` / `fb` / `line` / `edm`…）
- `copy.deadline` — 填 ISO 時間（例 `2026-09-30T23:59:59+08:00`）就會出現倒數；留空則整塊隱藏
- `plans[]` — 名稱、副標、封面、`original` / `pay` / `addonPay`、賣點列、`tone`（`blue` / `gold`）
- `bundle` — `enabled: false` 可整塊關掉
- `faq[]` / `company`

> 🔴 價格改了要同步改 99agent 後台，否則頁面寫的和結帳金額會對不上。

## 購物車按鈕落點

頁面預留了 `.cta-slot`，外部元件掛進去後預設按鈕會自動隱藏：

| `data-cta` | 位置 |
|---|---|
| `nav` | 導覽列右側 |
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
