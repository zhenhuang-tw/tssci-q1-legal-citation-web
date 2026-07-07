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
        <CitationToc
          :rules="categories"
          :language-filter="filter"
          :active-codes="activeCategoryCodes"
        />
      </div>

      <!-- Mobile TOC: details/summary wrapper -->
      <details class="toc-mobile">
        <summary>目錄</summary>
        <CitationToc
          :rules="categories"
          :language-filter="filter"
          :active-codes="activeCategoryCodes"
        />
      </details>

      <!-- Main content -->
      <div>
        <section
          v-for="cat in categories"
          v-show="filter.isVisible(cat.code)"
          :key="cat.code"
          :id="anchorId(cat.code)"
          :data-code="cat.code"
          class="citation-category"
        >
          <h2>{{ cat.code }} {{ cat.name || '' }}</h2>

          <template v-if="cat.description">
            <p v-if="typeof cat.description === 'string'">{{ cat.description }}</p>
            <p v-else v-for="(line, i) in cat.description" :key="i">{{ line }}</p>
          </template>

          <!-- Level-2 rules -->
          <template v-if="cat.rule">
            <template v-for="child in cat.rule" :key="child.code">
              <!-- Pure description: only code + description, no name -->
              <template v-if="isPureDescription(child)">
                <p
                  v-for="(line, i) in asDescriptionArray(child.description)"
                  :key="i"
                  :id="i === 0 ? anchorId(child.code) : undefined"
                >
                  {{ child.code }}
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="line" />
                </p>
              </template>

              <!-- Everything else: card -->
              <CitationCard v-else :rule="child" />
            </template>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

const { data: citationData } = await useAsyncData('citation-style', () =>
  queryCollection('citation_style').first(),
)

const categories = computed(() => (citationData.value?.rule ?? []) as CitationRule[])

const filter = useLanguageFilter()

const languageOptions = [
  { code: '2.', name: '中文 zh' },
  { code: '3.', name: '英文 en' },
  { code: '4.', name: '德文 de' },
  { code: '5.', name: '日文 ja' },
  { code: '6.', name: '法文 fr' },
]

function isPureDescription(rule: CitationRule): boolean {
  return !rule.name && !!rule.description
}

function asDescriptionArray(desc: string | string[] | undefined): string[] {
  if (!desc) return []
  return Array.isArray(desc) ? desc : [desc]
}

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}

// Lazy TOC: track which category sections are currently in view
// null = observer not yet fired (initial state, show nothing)
const activeCategoryCodes = ref<string[] | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const codes = new Set(activeCategoryCodes.value ?? [])
      for (const entry of entries) {
        const code = (entry.target as HTMLElement).dataset.code
        if (!code) continue
        if (entry.isIntersecting) {
          codes.add(code)
        } else {
          codes.delete(code)
        }
      }
      activeCategoryCodes.value = Array.from(codes)
    },
    { rootMargin: '0px 0px -60% 0px' },
  )

  document.querySelectorAll('.citation-category').forEach((el) => observer!.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
