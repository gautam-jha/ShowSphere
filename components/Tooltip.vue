<script>
export default {
  props: {
    text: String,
  },
  data() {
    return {
      showTooltip: false,
    }
  },
}
</script>

<template>
  <div class="relative inline-block" @mouseleave="showTooltip = false">
    <span @mouseover="showTooltip = true">
      <slot />
    </span>
    <div
      v-if="showTooltip"
      class="absolute z-10 p-2 bg-gray-800 text-white text-sm rounded-md shadow-lg w-96"
      style="bottom: 50px;left: 50%;transform: translateX(-50%);top: -110px;overflow: auto;"
    >
      {{ text }}
    </div>
  </div>
</template>
