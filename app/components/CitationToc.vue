<template>
  <nav aria-label="頁面大綱">
    <ol>
      <template v-for="cat in rules" :key="cat.code">
        <li v-if="languageFilter.isVisible(cat.code)">
          <a :href="`#${anchorId(cat.code)}`">{{ cat.code }} {{ cat.name || '' }}</a>
          <ol v-if="cat.rule && cat.rule.length > 0 && isActive(cat.code)">
            <TocItem v-for="child in cat.rule" :key="child.code" :rule="child" />
          </ol>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

const props = defineProps<{
  rules: CitationRule[]
  languageFilter: { isVisible: (code: string) => boolean }
  activeCodes?: string[] | null
}>()

function isActive(code: string): boolean {
  // null = observer not yet fired → hide all (clean initial load)
  if (props.activeCodes === null) return false
  // undefined (prop not passed) or empty → show all (backward compat)
  if (!props.activeCodes || props.activeCodes.length === 0) return true
  return props.activeCodes.includes(code)
}

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}
</script>
