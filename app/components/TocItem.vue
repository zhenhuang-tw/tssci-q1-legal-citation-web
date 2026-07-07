<template>
  <!-- Only render if this is a second-level rule (x.x) with a name -->
  <template v-if="isSecondLevel(rule.code) && rule.name">
    <li>
      <a :href="`#${anchorId(rule.code)}`">{{ rule.code }} {{ rule.name }}</a>
      <ol v-if="rule.rule && rule.rule.length > 0">
        <TocItem v-for="child in rule.rule" :key="child.code" :rule="child" />
      </ol>
    </li>
  </template>
  <!-- Not x.x or no name, but may have children that are → recurse without rendering self -->
  <template v-else-if="rule.rule && rule.rule.length > 0">
    <TocItem v-for="child in rule.rule" :key="child.code" :rule="child" />
  </template>
  <!-- Otherwise: skip entirely -->
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{
  rule: CitationRule
}>()

function isSecondLevel(code: string): boolean {
  return /^\d+\.\d+$/.test(code)
}

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}
</script>
