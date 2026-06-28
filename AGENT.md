# AGENT.md — TSCII Legal Citation Web

> 本文件記錄本專案的開發規範、架構決策與維護注意事項。  
> 內容為長期有效資訊，不包含一次性任務或需求細節。

---

## Tech Stack

| 項 | 值 |
|---|-----|
| 框架 | Nuxt 4（`app/` 目錄結構，`compatibilityVersion: 4`） |
| 內容 | Nuxt Content V3（`@nuxt/content`，主要用於 JSON import） |
| CSS | Pico CSS **class-less** |
| 語言 | TypeScript（`strict: true`） |
| 套件管理 | PNPM |
| 格式化 | Prettier（`.prettierrc` 控制） |

---

## 目錄結構（精簡）

```
app/
├── assets/css/main.css          # 全域樣式覆寫（僅元素/屬性選擇器 + CSS 變數）
├── components/
│   ├── AppHeader.vue / AppFooter.vue   # 全站 shell（含非官方聲明）
│   ├── ThemeToggle.vue                 # 亮/暗切換（SVG icon，無 emoji）
│   ├── CitationCard.vue               # 顯示 citation style 規則的卡片
│   ├── CitationFormatBlock.vue        # {$var} → <mark> highlight
│   ├── CitationToc.vue / TocItem.vue  # 大綱側欄（巢狀 <ol>）
│   └── RuleTree.vue                   # 遞迴 <details> 折疊樹
├── composables/
│   ├── useTheme.ts             # 主題（localStorage + auto + FOUC 防止）
│   └── useLanguageFilter.ts    # 語言篩選（localStorage，通則永遠顯示）
├── layouts/default.vue         # AppHeader + <slot /> + AppFooter
├── pages/
│   ├── index.vue               # 首頁
│   └── citations/index.vue     # 引註格式總覽（唯一內容頁，TOC + 篩選 + 折疊）
└── types/citation.ts           # CitationRule / MultipleTypeExample
content/
└── citation-style.json         # 遞迴巢狀 rule tree（單一資料來源）
```

---

## 資料層（Data Layer）

### 資料來源

**單一檔案**：`content/citation-style.json`。

### 頂層結構

```json
{
  "sourceDataIntroduction": { … },
  "schema": { … },
  "rule": [ … ]
}
```

`rule[]` 的第一層包含六個分類節點（`code: "1"` 到 `code: "6."`）。

### Rule 節點型別

```typescript
interface CitationRule {
  code: string                              // 階層編號，如 "2.7.1"
  name?: string                             // 人類可讀名稱（純描述性子規則可省略）
  description?: string | string[]           // 官方【格式】說明
  format?: string | string[]                // {$var} CSL 模板（可 machine-readable 時才出現）
  example?: string | string[] | Record<string, string | string[]>
  multipleTypeExample?: { type: string; example: string[] }[]
  webNote?: string                          // 本專案補充說明（使用者自行添加，官方文件所無）
  rule?: CitationRule[]                     // 子規則（遞迴）
}
```

### 節點類型識別

| 類型 | 判斷條件 | 渲染方式 |
|------|---------|---------|
| 分類容器 | `code` 為 `"1"` 或 `"N."` 格式，有 `name` + `rule` | 渲染 `<section>` + `<h2>` + 遞迴 RuleTree |
| 群組容器 | 有 `rule[]`，可選 `description` | `<details>` + `<summary>` + 遞迴 |
| 純描述規則 | 僅 `code` + `description`，無 `name` | `<p>` 或 `<li>` |
| 格式規則 | 有 `format` + `example` | `CitationCard` |

---

## 架構決策

### 1. 單頁引註瀏覽

所有規則顯示在 `/citations` 同一頁面，不拆分獨立分類路由。使用者透過 checkbox 篩選語言，`v-show` 控制顯示。沒有類似 `pages/citations/[category].vue` 這樣的路由。

### 2. 語言篩選

`useLanguageFilter` composable 管理勾選狀態，`localStorage` key 為 `'citation-languages'`。`code: "1"`（通則）**永遠顯示**，不受篩選影響。

### 3. 遞迴 RuleTree + 折疊

`RuleTree.vue` 遞迴走訪 `rule[]`：容器節點以 `<details>` 渲染（**預設收合**），葉節點以 `CitationCard` 渲染。不預先展開任何層級，除了那些僅是簡單說明的純描述規則外。

### 4. Pico CSS class-less 原則

`main.css` **不得使用 class-based 選擇器**。僅可使用：
- 元素選擇器（`body`、`details`、`mark`）
- 屬性選擇器（`nav[aria-label='頁面大綱']`）
- CSS 自訂變數（`var(--pico-color-*)`）

Component template 中的 class 僅為語義標記，不應在 `main.css` 中被 class 選擇器引用。

### 5. FOUC 防止 & ThemeToggle ClientOnly

`app.vue` 中注入 inline `<Script>`，於 `<head>` 解析階段設定 `data-theme` 屬性。此 script 在瀏覽器第一幀繪製前執行，避免亮/暗模式閃爍。

`ThemeToggle` 放在 `<ClientOnly>` 內，避免 SSR hydration mismatch（server 端無法取得 `localStorage`）。

---

## 常見陷阱

### citation-style.json 的編碼

- 日文文獻含全形／半形符號（`｢｣・` 等），不可替換為中文全形標點
- 部分 `example` 值含 HTML `<span class="italic">` 等標籤，渲染時需 `v-html`
- `description` 可能是 `string` 或 `string[]`，渲染時須判斷型別

### example 欄位的多型

`rule.example` 的型別可能為：
- `string` — 單一範例
- `string[]` — 多條範例
- `Record<string, string | string[]>` — 分類範例（如 `{ "已出版博士論文": "...", "已出版有序言": "..." }`）

### format 欄位可為陣列

部分規則（如英文文獻 3.3.3）有兩種引用格式，`format` 為 `string[]`。

### 不要使用 format 作為唯一說明

`description` 是官方【格式】的完整文字；`format` 僅在適合 machine-readable 時才存在，作為未來建立 `.csl` 檔案時參考。使用者看到的格式說明應來自 `description`。

### 不要 hardcode 引註內容

所有引註資料僅來自 `citation-style.json`。元件內不得有任何引註規則的 hardcode。

---

## 維護建議

### 更新引註資料

1. 直接修改 `content/citation-style.json`
2. 遵循現有的遞迴 rule tree 結構
3. 修改後務必確認：
   - 所有 `code` 無重複
   - `description`（官方【格式】）與原始文件一致
   - 適合的規則補上 `format`（`{$var}` 模板）

### 新增網站補充說明

在特定規則節點加入 `webNote` 欄位（字串），會顯示在 `CitationCard` 的 `<footer>` 中。

### 全形／半形校對

日文文獻對符號精度要求極高。修改內容後建議在瀏覽器中實際檢視，確認：
- 全形破折號（`—`）未誤判為長音符（`ー`）或漢字「一」
- 中黑點（`・`）未誤判為其他符號
- 括號全半形符合規則要求

### Commit 規範

使用 Conventional Commits：`type(scope): description`。常用 type：`feat`、`fix`、`chore`、`docs`。Scope 範例：`a11y`、`citations`、`composables`、`theme`。
