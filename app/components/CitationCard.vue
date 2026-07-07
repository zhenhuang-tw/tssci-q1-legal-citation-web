<template>
  <!-- Desktop: plain <div>; mobile: <details> collapsible -->
  <component
    :is="isMobile ? 'details' : 'div'"
    :id="anchorId(rule.code)"
    class="citation-card-wrapper"
  >
    <summary v-if="isMobile">{{ rule.code }} {{ rule.name }}</summary>
    <article class="citation-card">
      <header v-if="!isMobile">
        <h3>{{ rule.code }} {{ rule.name }}</h3>
      </header>

      <template v-if="rule.description">
        <p v-for="(line, i) in asDescriptionArray(rule.description)" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="line" />
        </p>
      </template>

      <!-- Example: string / string[] -->
      <template v-if="typeof rule.example === 'string' || Array.isArray(rule.example)">
        <blockquote v-for="(ex, i) in asArray(rule.example)" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ex" class="rule-example" />
        </blockquote>
      </template>

      <!-- Example: Record<string, string | string[]> -->
      <template v-else-if="typeof rule.example === 'object' && rule.example !== null">
        <div v-for="(val, key) in rule.example" :key="key">
          <strong>{{ key }}</strong>
          <blockquote v-for="(ex, j) in asArray(val as string | string[])" :key="j">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ex" class="rule-example" />
          </blockquote>
        </div>
      </template>

      <!-- Multiple type examples -->
      <template v-if="rule.multipleTypeExample && rule.multipleTypeExample.length > 0">
        <h4>範例</h4>
        <template v-for="(group, gi) in rule.multipleTypeExample" :key="gi">
          <strong>{{ group.type }}</strong>
          <blockquote v-for="(ex, ei) in asArray(group.example)" :key="ei">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="ex" class="rule-example" />
          </blockquote>
        </template>
      </template>

      <!-- Children (level 3+) -->
      <RuleDescendant v-for="child in rule.rule" :key="child.code" :rule="child" />

      <footer v-if="rule.webNote">
        <small>📝 {{ rule.webNote }}</small>
      </footer>
    </article>
  </component>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

defineProps<{ rule: CitationRule }>()

const isMobile = ref(false)

onMounted(() => {
  const mq = window.matchMedia('(max-width: 1023px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', (e) => {
    isMobile.value = e.matches
  })
})

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}

function asDescriptionArray(desc: string | string[]): string[] {
  return Array.isArray(desc) ? desc : [desc]
}

function asArray(val: string | string[]): string[] {
  return Array.isArray(val) ? val : [val]
}
</script>
