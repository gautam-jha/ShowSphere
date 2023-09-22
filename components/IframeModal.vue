<script setup lang="ts">
import { onMounted } from 'vue'
import { onKeyDown } from '@vueuse/core'

const src = ref<string | null>(null)
const sandbox = ref<boolean>(true)

function showModal({ link, isSandbox }: { link: string; isSandbox: boolean }) {
  src.value = link
  sandbox.value = isSandbox
}
const el = ref<HTMLIFrameElement>()

provideIframeModal(showModal)

onKeyDown('Escape', () => {
  if (src.value) 
    src.value = null
})

onClickOutside(el, () => {
  src.value = null
})
onMounted(()=>{
  console.log('mounted')
  if (window) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.open = (url?: string, target?: string) => {
      console.log('windowopen', url, target)
      return null
    }
  }
})
</script>

<template>
  <div v-if="src" fixed top-0 left-0 right-0 bottom-0 z-10 bg-black:90 flex>
    <button
      absolute
      top-1
      right-1
      z-100
      p3
      text-3xl
      n-link
      bg-black:60
      rounded-full
      title="Close"
      @click="src = null"
    >
      <div i-carbon-close />
    </button>
    <iframe
      v-if="sandbox"
      ref="el"
      allow="autoplay; encrypted-media"
      allowfullscreen
      :src="src"
      w-full
      m5
      lg:m20
      border-none
      sandbox="allow-scripts allow-same-origin"
    />
    <iframe
      v-else
      ref="el"
      allow="autoplay; encrypted-media"
      allowfullscreen
      :src="src"
      w-full
      m5
      lg:m20
      border-none
    />
  </div>
</template>
