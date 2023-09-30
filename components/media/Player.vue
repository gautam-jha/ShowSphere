<script setup lang="ts">
// import { getVideoServer2 } from '~/composables/item'
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
  public: { streamUrl, stream2Url },
} = useRuntimeConfig()

const showModal = useIframeModal()
const route = useRoute()
const id = computed(() => route.params.id as string)

const type = computed(() => (route.params.type as MediaType) || 'movie')
const url = computed(
  () => `${streamUrl}${getVideoServer(props.item, type.value)}`,
)
const url2 = computed(() => `${stream2Url}${getVideoServer2(props.item)}`)
const data = reactive<{
  selectedSeason: Seasons
  selectedServer: number
  watched: null | Map<string, boolean>
}>({ selectedSeason: {} as Seasons, selectedServer: 1, watched: null })
function playMovie(server: number) {
  if (server === 1) 
    showModal({ link: url.value, isSandbox: false })

  if (server === 2) 
    showModal({ link: url2.value, isSandbox: false })
}

onBeforeMount(() => {
  // Get the existing map from local storage or create an empty map if the key doesn't exist
  const key = `watched_${id.value}`

  const storedData = localStorage.getItem(key)
  if (storedData) 
    data.watched = new Map(JSON.parse(storedData) || [])
  
})

function selectedSeasonHandler(selectedSeason: Seasons) {
  data.selectedSeason = selectedSeason
}
function updateWatched({
  season,
  episode,
}: {
  season: number
  episode: number
}) {
  const key = `watched_${id.value}`

  if (data.watched) {
    // Add a new key-value pair to the map
    data.watched.set(`S${season}E${episode}`, true)

    // Store the updated map back in local storage
    localStorage.setItem(
      key,
      JSON.stringify(Array.from(data.watched.entries())),
    )
  }
}
function playTv(season: number, episode: number) {
  updateWatched({ season, episode })
  if (data.selectedServer === 1) {
    showModal({
      link: `${url2.value}&s=${season}&e=${episode}`,
      isSandbox: false,
    })
  }
  else {showModal({ link: `${url.value}/${season}/${episode}`, isSandbox: false })}
}
function handleServer(id: number) {
  data.selectedServer = id
}
const seasons = props.item?.seasons
</script>

<template>
  <div :key="item.id" w-full bg-black p="b-12 t-8">
    <CarouselBase v-if="item.id">
      <template #title>
        {{
          type === 'movie' ? $t('Available Servers') : $t('Seasons & Episodes')
        }}
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
            :disabled="i > 2"
            @click="playMovie(i)"
          >
            <div i-ph-play />
            {{ $t('Server') }} #{{ i }}
          </button>
        </div>
        <div v-else class="sources">
          <div flex gap-2>
            <CarouselSeason
              v-if="seasons?.length"
              :seasons="
                seasons
                  .filter((s) => s.name.toLowerCase() !== 'specials')
                  .sort((a, b) => a.season_number - b.season_number)
              "
              @selected-season="selectedSeasonHandler"
            />
          </div>
        </div>
      </div>
    </CarouselBase>
    <div v-if="type === 'tv' && data.selectedSeason" flex justify-center>
      <fieldset class="grid grid-cols-2 gap-4 w-80">
        <div v-for="i in [1, 2]" :key="i">
          <input
            :id="`Server${i}`"
            type="radio"
            name="servers"
            :value="`Server${i}`"
            class="peer hidden [&:checked_+_label_svg]:block"
            :checked="i === 1 ? true : false"
            @change="handleServer(i)"
          >

          <label
            :for="`Server${i}`"
            class="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500"
          >
            <div class="flex items-center justify-between">
              <p class="text-gray-700">Server {{ i }}</p>

              <svg
                class="hidden h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </label>
        </div>
      </fieldset>
    </div>
    <div
      v-if="type === 'tv' && data.selectedSeason"
      class="grid grid-cols-[repeat(auto-fill,_190px)] grid-gap-3 mx-auto justify-center items-center"
      p="t-10 x-2 md:x-10"
    >
      <div v-for="index in data.selectedSeason?.episode_count" :key="index">
        <button
          flex="~ gap2"
          justify-center
          p="x6 y3"
          w-48
          bg="gray/15 hover:gray/20 disabled:gray/8 disabled:pointer-not-allowed"
          :class="{ 'opacity-50': data.watched.get(`S${data.selectedSeason.season_number}E${index}`) }"
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
