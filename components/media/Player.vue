<script setup lang="ts">
import type { Media, MediaType, Seasons } from '~/types'

const props = withDefaults(
  defineProps<{
    item: Media
  }>(),
  {
    item: () => ({} as Media),
  },
)

const {
  public: { streamUrl },
} = useRuntimeConfig()

const showModal = useIframeModal()
const route = useRoute()

const type = computed(() => (route.params.type as MediaType) || 'movie')
const url = computed(() => `${streamUrl}${getVideoServer(props.item, type.value)}`)
const data = reactive<{
  selectedSeason: Seasons
}>({ selectedSeason: {} as Seasons })
function playMovie() {
  showModal(url.value)
}

function selectedSeasonHandler(selectedSeason: Seasons) {
  data.selectedSeason = selectedSeason
}

function playTv(season: number, episode: number) {
  showModal(`${url.value}/${season}/${episode}`)
}
const seasons = props.item?.seasons
</script>

<template>
  <div :key="item.id" w-full bg-black p="b-12 t-8">
    <CarouselBase v-if="item.id">
      <template #title>
        {{ type === 'movie' ? $t('Available Servers') : $t('Seasons & Episodes') }}
      </template>
      <div>
        <div v-if="type === 'movie'" flex flex-wrap gap-2 class="sources">
          <button
            v-for="i in [1, 2, 3]"
            :key="i"
            flex="~ gap2"
            items-center
            p="x6 y3"
            bg="gray/15 hover:gray/20 disabled:gray/8 disabled:pointer-not-allowed"
            transition
            :title="$t('Watch Movie')"
            :disabled="i !== 1"
            @click="playMovie()"
          >
            <div i-ph-play />
            {{ $t('Server') }} #{{ i }}
          </button>
        </div>
        <div v-else class="sources">
          <div flex gap-2>
            <CarouselSeason
              v-if="seasons?.length"
              :seasons="seasons.filter((s) => s.name.toLowerCase() !== 'specials').sort((a, b) => a.season_number - b.season_number)"
              @selected-season="selectedSeasonHandler"
            />
          </div>
        </div>
      </div>
    </CarouselBase>
    <div v-if="type === 'tv' && data.selectedSeason" class="grid grid-cols-[repeat(auto-fill,_190px)] grid-gap-3 mx-auto justify-center items-center" p="t-10 x-2 md:x-10">
      <div v-for="index in data.selectedSeason?.episode_count" :key="index">
        <button
          flex="~ gap2"
          justify-center
          p="x6 y3"
          w-48
          bg="gray/15 hover:gray/20 disabled:gray/8 disabled:pointer-not-allowed"
          transition
          :title="$t('Watch Movie')"
          @click="playTv(data.selectedSeason.season_number, index)"
        >
          <div i-ph-play />
          {{ $t('EP') }} #{{ index }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.hero-enter-active,
.hero-leave-active {
  transition: transform 0.75s cubic-bezier(0.4, 0.25, 0.3, 1),
    opacity 0.3s cubic-bezier(0.4, 0.25, 0.3, 1);
}

.hero-enter-from,
.hero-leave-to {
  opacity: 0;
  transform: translate3d(0, 2rem, 0);
}

.hero-enter-to,
.hero-leave-from {
  opacity: 1;
  transform: translateZ(0);
}
</style>
