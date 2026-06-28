<template>
  <article class="citation-card">
    <header>
      <h3>{{ rule.code }} {{ rule.name }}</h3>
    </header>

    <!-- Description (official format) -->
    <p v-if="rule.description">
      <template v-if="Array.isArray(rule.description)">
        <template v-for="(line, i) in rule.description" :key="i">
          {{ line }}<br v-if="i < rule.description.length - 1" />
        </template>
      </template>
      <template v-else>{{ rule.description }}</template>
    </p>

    <!-- Format template -->
    <blockquote v-if="rule.format">
      <template v-if="Array.isArray(rule.format)">
        <p v-for="(f, i) in rule.format" :key="i">
          <CitationFormatBlock :format="f" />
        </p>
      </template>
      <template v-else>
        <CitationFormatBlock :format="rule.format" />
      </template>
    </blockquote>

    <!-- Examples -->
    <section v-if="hasExamples">
      <h4>範例</h4>
      <ul v-if="Array.isArray(rule.example)">
        <li v-for="(ex, i) in rule.example" :key="i">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="ex" />
        </li>
      </ul>
      <ul v-else-if="typeof rule.example === 'string'">
        <li>
          <span v-html="rule.example" />
        </li>
      </ul>
      <template v-else-if="typeof rule.example === 'object'">
        <div v-for="(val, key) in rule.example" :key="key">
          <strong>{{ key }}</strong>
          <blockquote v-if="typeof val === 'string'">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="val" />
          </blockquote>
          <ul v-else-if="Array.isArray(val)">
            <li v-for="(ex, j) in val" :key="j">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="ex" />
            </li>
          </ul>
        </div>
      </template>
    </section>

    <!-- Multiple type examples -->
    <section v-if="rule.multipleTypeExample && rule.multipleTypeExample.length > 0">
      <h4>範例</h4>
      <template v-for="(group, gi) in rule.multipleTypeExample" :key="gi">
        <h5>{{ group.type }}</h5>
        <ul>
          <li v-for="(ex, ei) in group.example" :key="ei">{{ ex }}</li>
        </ul>
      </template>
    </section>

    <!-- Sub-rules rendered inline inside this card -->
    <slot />

    <!-- Web note -->
    <footer v-if="rule.webNote">
      <small>📝 {{ rule.webNote }}</small>
    </footer>
  </article>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

const props = defineProps<{ rule: CitationRule }>()

const hasExamples = computed(() => {
  return (
    props.rule.example !== undefined ||
    (props.rule.multipleTypeExample && props.rule.multipleTypeExample.length > 0)
  )
})
</script>
