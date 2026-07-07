# TSSCI Q1 法學引註格式檢索

> 本專案不是由國科會或法律學門各 TSSCI 一級期刊提供，只整理其公告的引註格式，建立非官方檢索平台，方便參考。如有疑義，請以官方公告文件為準。

各 TSSCI 一級期刊協同公告之文件，請點[統一公告文件](https://drive.google.com/drive/u/0/folders/15uWIodb8D7JFNnkctlm2OcJ4TWUha6dv)查看（2026 年 5 月 18 日修訂，連結取自召集人孫迺翊老師 FB 留言）。

## 專案簡介

本網站以網頁呈現臺灣 TSSCI 一級法學期刊共同制定的引註格式，讓使用者無需查閱 PDF 即可瀏覽。

## 如何查閱

請點選〈[TSSCI Q1 法學引註格式](https://legalcite.zhenhuang.tw/)〉來查看。網站首頁簡要介紹專案，查詢頁面則提供依語言、依參考文獻類型來顯示的篩選功能。

## Tech Stack

| 層次 | 技術 |
|------|------|
| 框架 | Nuxt |
| 內容管理 | Nuxt Content V3 |
| UI | Pico CSS |
| 套件管理 | PNPM |

## 目錄結構

```
tssci-q1-legal-citation-web/
├── app/
│   ├── assets/
│   │   └── css/
│   │       └── main.css             # 全域自訂樣式（dark mode token override 等）
│   ├── components/
│   │   ├── AppHeader.vue            # 全站頁首（含非官方聲明 banner）
│   │   ├── AppFooter.vue            # 全站頁尾（含非官方聲明）
│   │   ├── ThemeToggle.vue          # 亮暗色模式切換按鈕
│   │   └── CitationCard.vue         # 單一引註格式卡片
│   ├── composables/
│   │   └── useTheme.ts              # 主題切換邏輯（含 localStorage 持久化）
│   ├── layouts/
│   │   └── default.vue              # 預設 layout（包含 AppHeader + AppFooter）
│   └── pages/
│       ├── index.vue                # 首頁
│       └── citations/
│           └── index.vue            # 引註格式總覽（可依分類、依語言，在使用者端篩選）
├── content/
│   └── citation-style.json
├── content.config.ts                # Nuxt Content V3 Collection 定義
├── nuxt.config.ts
├── tsconfig.json
├── package.json
└── README.md
```
