<script setup lang="ts">
import type { Seasons } from '~/types'

const { seasons } = defineProps<{
  seasons: Seasons[]
}>()
const emit = defineEmits<{
  (e: 'selectedSeason', selectedSeason: Seasons): void
}>()
const obj = reactive({
  selected: 0,
})
function clickHandler(season: Seasons) {
  obj.selected = season.id
  emit('selectedSeason', season)
}

onMounted(() => {
  if (seasons && seasons[0]) {
    obj.selected = seasons[0].id
    emit('selectedSeason', seasons[0])
  }
})
</script>

<template>
  <div
    v-for="season in seasons"
    :key="season.id"
    class="flex flex-1 max-h-80 w-80 md:w-96 bg-white transition hover:shadow-xl hover:cursor-pointer" :class="{
      'bg-yellow-300': season.id === obj.selected,
    }"
    @click="clickHandler(season)"
  >
    <div class="rotate-180 p-2 [writing-mode:_vertical-lr]">
      <time
        :datetime="season?.air_date"
        class="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
      >
        <span>{{ season?.air_date?.slice(0, 4) }}</span>
        <span class="w-px flex-1 bg-gray-900/10" />
        <span>{{ season?.air_date?.slice(5) }}</span>
      </time>
    </div>

    <div class="hidden sm:block sm:basis-56">
      <NuxtImg
        width="400"
        height="600"
        format="webp"
        :src="`/tmdb${season.poster_path}`"
        :alt="season.name"
        h-full
        w-full
        object-cover
      />
    </div>

    <div class="flex flex-1 flex-col justify-between">
      <div
        class="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6"
      >
        <a href="#">
          <h3 class="font-bold uppercase text-gray-900">
            {{ season.name }}
          </h3>
        </a>
        <Tooltip :text="season.overview">
          <p
            class="mt-2 line-clamp-3 text-sm/relaxed text-gray-700"
          >
            {{ season.overview }}
          </p>
        </Tooltip>
      </div>

      <div class="sm:flex sm:items-end sm:justify-end">
        <a
          href="#"
          class="block bg-yellow-300 px-5 py-3 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
          @click="($event) => $event.preventDefault()"
        >
          >
          {{ $t('#ep') }} {{ season.episode_count }}
        </a>
      </div>
    </div>
  </div>
</template>
