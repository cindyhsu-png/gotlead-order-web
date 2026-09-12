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

### A. `'99agent'` — 備援

導到 `all.99agent.app/plangotlead5?code=<存取碼>&src=<來源>&plan=<方案代碼>`。
一個方案一顆按鈕，帶得動 promotion code。

### B. `'kolable'` — 目前生效

導到 dnschool（數位遊牧學院）的專案頁 `dnschool.kolable.app/projects/9737162e-…`。

| | |
|---|---|
| 專案 | `9737162e-8778-4b6f-af82-76ad0ac5fe5e`「AI 獲客副業實戰」 |
| 方案 1 | `bf19c120-362f-45a6-a1b3-aa27c02490c6` AI 獲客副業實戰 |
| 方案 2 | `5e4c71ea-0564-4976-9066-f54eb0fe1e23` 行銷大師 24 大模組 |

> ⚠️ **Kolable 沒有「一鍵直達某方案」的網址參數。** 查過前台 route table，購物車只有無參數的 `/cart`，bundle 裡也沒有 `projectPlanId` / `visitIntro` 這類 query param。所以兩顆按鈕只能導到同一個專案頁，使用者到那邊自己挑方案 → 加入購物車 → 結帳。就算有參數也沒用——我們在不同網域，寫不進對方的購物車 localStorage。

`checkout.kolable.sharingCode` 是 Kolable 的推廣碼欄位，要做代銷分潤時填這裡。

### ⚠️ Kolable 端還沒處理完的事

專案已於 2026-09-12 發布，公開頁打得開。但以下三項客人看得到：

1. **兩個方案都是訂閱制**（`is_subscription: true`，週期 1 年）。公開頁顯示「**$32,000 / 年**」「**立即訂閱**」，本頁只寫 NT$ 32,000。要嘛把 Kolable 改成一次付清，要嘛本頁價格補上「/ 年」。
2. **行銷大師原價顯示 $960,000 / 年**，多一個 0（應為 96,000）。折扣率看起來假。
3. **`sold_at` = 2026-09-12 17:00（台北）** 販售截止，過了就買不到。

這三項的欄位 GraphQL 沒開寫入，要從後台 salesPlan 頁手動改。

## 嵌入 Kolable（或任何外站）

頁面被 `<iframe>` 嵌入時會自動進入**嵌入模式**（偵測 `window.self !== window.top`）：

1. 用 `postMessage` 把內容高度回報給父頁 → 父頁把 iframe 撐到等高 → **內層卷軸消失，只剩外層一條**
2. 手機版底部固定下單列自動隱藏（iframe 被撐高後沒有自己的視窗，`position:fixed` 會黏在整份內容底部，不再是使用者眼前）
3. 作品集燈箱改成絕對定位，開在被點的那張卡旁邊，不會跑到 iframe 最頂端

### 父頁要放的程式碼

```html
<section style="width:100%">
  <iframe id="gotlead-frame"
    src="https://cindyhsu-png.github.io/gotlead-order-web/"
    title="GotLead 訂單系統"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="fullscreen; clipboard-write"
    style="width:100%;height:720px;border:0;display:block"></iframe>
</section>
<script>
(function(){
  var ORIGIN='https://cindyhsu-png.github.io';
  function frame(){ return document.getElementById('gotlead-frame') }
  window.addEventListener('message',function(e){
    if(e.origin!==ORIGIN) return;
    var d=e.data||{}; if(d.type!=='gotlead:height'||!d.height) return;
    var f=frame(); if(f) f.style.height=d.height+'px';
  });
  function tellViewport(){
    var f=frame(); if(!f||!f.contentWindow) return;
    var r=f.getBoundingClientRect();
    f.contentWindow.postMessage({type:'gotlead:viewport',top:Math.max(0,-r.top)},ORIGIN);
  }
  window.addEventListener('scroll',tellViewport,{passive:true});
})();
</script>
```

> 🔴 外層 **不要**包 `height:100dvh` + `overflow:hidden` 的容器 —— 那正是雙卷軸的來源。
> `loading="lazy"` 也建議拿掉，它會延後載入、連帶延後高度回報。
> Kolable 的「嵌入」元件用 `createContextualFragment` 渲染，會執行 `<script>`，所以上面這段貼進去就會跑。
