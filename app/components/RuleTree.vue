<template>
  <!-- Container node: has children, wrap in collapsible <details> -->
  <details v-if="rule.rule" data-rule-tree>
    <summary>
      <span>{{ rule.code }}</span>
      <span v-if="rule.name">{{ rule.name }}</span>
    </summary>

    <p v-if="rule.description && rule.rule">
      <template v-if="Array.isArray(rule.description)">
        <template v-for="(line, i) in rule.description" :key="i">
          {{ line }}<br v-if="i < rule.description.length - 1" />
        </template>
      </template>
      <template v-else>{{ rule.description }}</template>
    </p>

    <RuleTree
      v-for="child in rule.rule"
      :key="child.code"
      :rule="child"
    />
  </details>

  <!-- Leaf: has format or example or multipleTypeExample -> CitationCard -->
  <CitationCard
    v-else-if="
      rule.format !== undefined ||
      rule.example !== undefined ||
      (rule.multipleTypeExample && rule.multipleTypeExample.length > 0)
    "
    :rule="rule"
  />

  <!-- Pure description rule: no name, no children, no examples -> flat <p> -->
  <p v-else-if="rule.description">
    {{ rule.code }}
    <template v-if="Array.isArray(rule.description)">
      <template v-for="(line, i) in rule.description" :key="i">
        {{ line }}<br v-if="i < rule.description.length - 1" />
      </template>
    </template>
    <template v-else>{{ rule.description }}</template>
  </p>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{ rule: CitationRule }>()
</script>
