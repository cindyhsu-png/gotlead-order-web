/* 商品與下單落點設定 — 這支是整個站唯一要改的檔案
 *
 * 資料來源：https://all.99agent.app/plangotlead5?code=VWJE0619D_2DWD_2&src=qr
 * 金額與 code 是從該頁抓下來的真實值，改價請同步改 99agent 後台，否則會對不上。
 */
window.ORDER_CONFIG = {
  // ── 下單落點 ──────────────────────────────────────────────────────
  // 金流、發票、訂單紀錄都在 99agent，本站只負責把人帶到結帳頁。
  checkout: {
    base: 'https://all.99agent.app/plangotlead5',
    accessCode: 'VWJE0619D_2DWD_2', // 這頁的存取碼，換活動頁就換這個
    source: 'web',                  // 來源標記，之後要分流量就改這裡（qr / fb / line / edm…）
    // 帶著 promotion code 進站，讓對方一進去就停在對的方案上
    param: { code: 'code', src: 'src', plan: 'plan' },
  },

  // ── 頁面文案 ──────────────────────────────────────────────────────
  copy: {
    eyebrow: 'TONIGHT OFFERS',
    title: '選擇今晚要保留的方案',
    lead: '截止前成立的訂單會保留當下付款金額；截止後本頁會以原價建立訂單，限量名額也會歸零。',
    deadline: '', // 例：'2026-09-30T23:59:59+08:00'，留空則不顯示倒數
  },

  // ── 方案 ──────────────────────────────────────────────────────────
  plans: [
    {
      code: 'LIVE_VIBE_38000_PLANHUBER_PLANHUBER2',
      name: 'AI 獲課副業實戰',
      sub: '適合想動手開發自動化獲得客戶的人',
      cover:
        'https://storage.googleapis.com/99agent-public/marketing-promotions/covers/1783843963969-e027c4ac-44ef-47c9-8b53-94aad597798e-LIVE_VIBE_38000_PLANHUBER_PLANHUBER2.jpg',
      original: 126000,
      pay: 32000,
      addonPay: 14000, // 當成加購品時的價格（合購折 18,000）
      tone: 'blue',
      points: [
        '網站建立付款訂單與發票紀錄',
        '課程交付由老師透過外部頁面手動安排',
        '付款成功後可在我的訂單查詢紀錄',
      ],
    },
    {
      code: 'LIVE_MASTER_48000_N8N2_2_PLANHUBER2_3',
      name: '行銷大師 24 大模組',
      sub: '適合想直接購買軍火經營生態系道路的人',
      cover:
        'https://storage.googleapis.com/99agent-public/marketing-promotions/covers/1781094723707-5e33b8b2-9828-485f-a31a-37d9a18ba516-LIVE_MASTER_48000.jpg',
      original: 96000,
      pay: 48000,
      addonPay: 30000,
      tone: 'gold',
      points: [
        '包含 6 大模組，剩餘 18 個模組預購，半年內交付',
        '付款後開通行銷大師權益，先交付已上線模組',
        '後續 18 個模組依交付節奏陸續補齊',
        '可以代理我們的系統，賦能自己的生態系',
      ],
    },
  ],

  // ── 合購 ──────────────────────────────────────────────────────────
  // 兩案一起買：主方案原價 + 加購方案折 18,000。哪一案當主方案結果都是 62,000。
  bundle: {
    enabled: true,
    primary: 'LIVE_MASTER_48000_N8N2_2_PLANHUBER2_3',
    label: '兩案一起帶走',
    note: '主方案照優惠價、另一案再折 NT$ 18,000。兩邊當主方案結果一樣。',
  },

  // ── 常見問題 ──────────────────────────────────────────────────────
  faq: [
    { q: '怎麼付款？', a: '按下單後會導到 99agent 結帳頁，可用信用卡一次付清；付款成功後在「我的訂單」查得到紀錄。' },
    { q: '有發票嗎？', a: '有。結帳時填寫發票資訊，系統會自動開立。' },
    { q: '什麼時候可以開始上課／使用模組？', a: '課程由老師透過外部頁面安排；模組付款後先開通已上線的 6 個，其餘 18 個半年內依交付節奏補齊。' },
    { q: '可以只買其中一個嗎？', a: '可以。兩個方案各自獨立，合購只是價格上再折。' },
  ],

  // ── 公司資訊 ──────────────────────────────────────────────────────
  company: {
    name: '適才科技股份有限公司',
    addr: '臺北市中山區民生東路 1 段 87 號 2 樓',
    tel: '(02)7729-2477',
    vat: '83122943',
    links: [
      { t: '使用條款', h: 'https://all.99agent.app/terms' },
      { t: '隱私權條款', h: 'https://all.99agent.app/privacy' },
      { t: '系統合約', h: 'https://all.99agent.app/system-contract' },
    ],
  },
};
