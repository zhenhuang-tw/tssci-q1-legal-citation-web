<template>
  <div>
    <h1>法律學門 TSSCI 一級期刊引註格式</h1>

    <p>
      這個網站以網頁形式，呈現臺灣 TSSCI 一級法學期刊共同制定之引註格式，讓使用者無需查閱 PDF
      即可快速瀏覽各類文獻的引用規範。
    </p>
    <p>
      資料涵蓋通則及中文、英文、德文、日文及法文等五種語言引註格式，但原文件的致謝部分，則因採用
      GitHub 公開儲存庫，為避免未來可能的被遺忘權主張，爰未匯入。
    </p>
    <p>
      本網站的資料是從法律學門召集人孫迺翊教授 FB 留言中 Google Drive
      連結（2026年5月18日修訂版本）下載，再由個人整理為結構化資料、設定格式，不是官方提供的查詢介面，僅供參考。如有疑義，請以官方公告文件為準。
    </p>

    <h2>瀏覽引註格式</h2>
    <nav>
      <ul>
        <li v-for="cat in categories" :key="cat.code">
          <a :href="`/citations#${anchorId(cat.code)}`" v-if="cat.code != '1.'">
            {{ cat.name }}
          </a>
        </li>
      </ul>
    </nav>

    <p>
      <a href="/citations">引註格式總覽 →</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import citationData from '~~/content/citation-style.json'
import type { CitationRule } from '~/types/citation'

const categories = citationData.rule as CitationRule[]

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}
</script>
