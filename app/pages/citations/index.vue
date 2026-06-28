<template>
  <div>
    <h1>引註格式總覽</h1>

    <!-- Language filter -->
    <fieldset class="language-filter">
      <legend>顯示語言</legend>
      <label v-for="lang in languageOptions" :key="lang.code">
        <input
          type="checkbox"
          :checked="filter.isVisible(lang.code)"
          @change="filter.toggle(lang.code)"
        />
        {{ lang.name }}
      </label>
    </fieldset>

    <!-- TOC + Content layout -->
    <div class="citations-layout">
      <!-- Desktop TOC: visible sidebar -->
      <div class="toc-desktop">
        <CitationToc :rules="categories" :language-filter="filter" />
      </div>

      <!-- Mobile TOC: details/summary wrapper -->
      <details class="toc-mobile">
        <summary>目錄</summary>
        <CitationToc :rules="categories" :language-filter="filter" />
      </details>

      <!-- Main content -->
      <div>
        <section
          v-for="cat in categories"
          v-show="filter.isVisible(cat.code)"
          :key="cat.code"
          :id="anchorId(cat.code)"
          class="citation-category"
        >
          <h2>{{ cat.code }} {{ cat.name || '' }}</h2>

          <template v-if="cat.description">
            <p v-if="typeof cat.description === 'string'">{{ cat.description }}</p>
            <p v-else v-for="(line, i) in cat.description" :key="i">{{ line }}</p>
          </template>

          <div v-if="cat.rule">
            <RuleTree v-for="child in cat.rule" :key="child.code" :rule="child" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import citationData from '~~/content/citation-style.json'
import type { CitationRule } from '~/types/citation'

const categories = citationData.rule as CitationRule[]

const filter = useLanguageFilter()

const languageOptions = [
  { code: '2.', name: '中文 zh' },
  { code: '3.', name: '英文 en' },
  { code: '4.', name: '德文 de' },
  { code: '5.', name: '日文 ja' },
  { code: '6.', name: '法文 fr' },
]

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}
</script>
