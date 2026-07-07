<template>
  <div>
    <!-- Pure description (no name, only description) -->
    <template v-if="isPureDesc">
      <p
        v-for="(line, i) in asDescriptionArray(rule.description)"
        :key="i"
        :id="i === 0 ? anchorId(rule.code) : undefined"
      >
        {{ rule.code }}
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="line" />
      </p>
    </template>

    <!-- Named rule -->
    <template v-else>
      <component :is="headingTag" v-if="rule.name" :id="anchorId(rule.code)">
        {{ rule.code }} {{ rule.name }}
      </component>

      <p v-for="(line, i) in asDescriptionArray(rule.description)" :key="i">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="line" />
      </p>

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

      <!-- Recursive children -->
      <RuleDescendant v-for="child in rule.rule" :key="child.code" :rule="child" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CitationRule } from '~/types/citation'

const props = defineProps<{ rule: CitationRule }>()

const isPureDesc = computed(() => !props.rule.name && !!props.rule.description)

const depth = computed(() => props.rule.code.split('.').filter(Boolean).length)

const headingTag = computed(() => (depth.value >= 4 ? 'h4' : 'h3'))

function anchorId(code: string): string {
  return code.replace(/\.$/, '').replace(/\./g, '-')
}

function asArray(val: string | string[]): string[] {
  return Array.isArray(val) ? val : [val]
}

function asDescriptionArray(desc: string | string[] | undefined): string[] {
  if (!desc) return []
  return Array.isArray(desc) ? desc : [desc]
}
</script>
