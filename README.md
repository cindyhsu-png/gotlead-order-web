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

| | |
|---|---|
| 專案 | `9737162e-8778-4b6f-af82-76ad0ac5fe5e`「AI 獲客副業實戰」 |
| 方案 1 | `4d039b6f-ed11-46b0-8a4a-90d26ff34ecd` AI 獲客副業實戰 |
| 方案 2 | `9f9eadba-78c2-43a8-89c7-9cb4dcead86a` 行銷大師 24 大模組 |

**嵌在 dnschool 站內時（正常情況）**：按鈕不走連結，而是 `postMessage` 一則
`gotlead:checkout` 給父頁。父頁跟 Kolable 同網域，所以能直接寫購物車再跳結帳：

```
子頁按鈕 → postMessage{productIds} → 父頁寫 localStorage['kolable.cart._products']
        → location = /cart?direct=true → 結帳
```

購物車的資料格式是照 Kolable 自己的「加入購物車」按鈕實測抄下來的：

```json
[{"productId":"ProjectPlan_<uuid>","shopId":"",
  "options":{"from":"/projects/<projectId>","sharingCode":null,"tracking":{}},
  "enrollments":[]}]
```

合購按鈕會一次寫入兩筆。**寫入是取代，不是追加** —— 按哪個方案就結哪個方案。

**沒嵌在站內時**（單獨開本頁、或父頁沒裝處理程式）：1.2 秒後退回開啟
`專案頁?tabkey=plans#funding-plans`，按鈕不會變成死的。

> ⚠️ `/cart` **不吃網址參數**。`?direct=true` 只是「立即購買」按下去之後導向的網址，
> 意思是「直接結帳」，本身不帶商品；購物車一律讀 localStorage。
> 所以「一鍵直達結帳」只有在站內嵌入時成立 —— 跨網域寫不進對方的 localStorage。

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
    var d=e.data||{};

    // 一、把 iframe 撐到跟內容一樣高（消除雙卷軸）
    if(d.type==='gotlead:height'&&d.height){
      var f=frame(); if(f) f.style.height=d.height+'px';
      return;
    }

    // 二、把方案寫進購物車並跳結帳
    if(d.type==='gotlead:checkout'&&d.productIds&&d.productIds.length){
      try{
        localStorage.setItem('kolable.cart._products', JSON.stringify(
          d.productIds.map(function(pid){
            return {productId:pid,shopId:'',
              options:{from:d.from||'',sharingCode:d.sharingCode||null,tracking:{}},
              enrollments:[]};
          })));
      }catch(err){}
      window.location.href='/cart?direct=true';
    }
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
