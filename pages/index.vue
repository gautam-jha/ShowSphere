<script setup lang="ts">
import type { MediaType } from '~/types'
import { QUERY_LIST } from '~/constants/lists'

const route = useRoute()
const type = computed(() => route.params.type as MediaType || 'movie')

const queries = computed(() => [
  QUERY_LIST.movie[1],
  QUERY_LIST.movie[2],
  QUERY_LIST.movie[3],
  QUERY_LIST.tv[1],
])

const AsyncWrapper = defineComponent({
  name: 'AsyncWrapper',
  async setup(_, ctx) {
    const list = await listMedia(type.value, queries.value[0].query, 1)
    const item = await getMedia(type.value, list.results[0].id)
    return () => ctx.slots?.default?.({ item })
  },
})
</script>

<template>
  <div>
    <AsyncWrapper v-slot="{ item }">
      <NuxtLink :to="`/${type}/${item.id}/${(item.name ?? item.title)?.toLowerCase()?.replace(/\W/g, '-')}`">
        <MediaHero :item="item" />
      </NuxtLink>
    </AsyncWrapper>
    <CarouselAutoQuery
      v-for="query of queries"
      :key="query.type + query.query"
      :query="query"
    />
    <TheFooter />
  </div>
</template>
