<script lang="ts">
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import { recreateURL } from '$lib/ts/utils'

  export let display: boolean
  export let resImg: Blob | undefined
  export let error: number
  export let loading: boolean
  $: if (resImg) resImgUrl = recreateURL(resImgUrl, resImg)
  else resImgUrl = recreateURL(resImgUrl, '')

  let resImgUrl = ''
</script>

<div class="relative w-full h-full flex-col justify-center items-center {display ? 'flex' : 'hidden'}">
  {#if resImgUrl}
    <img class={loading ? 'opacity-50' : ''} src={resImgUrl} alt="Generated" />
  {:else if error !== 200}
    <b>Error: {error}</b>
    <p>Please try to generate it again</p>
  {:else if !loading}
    <p>Type Prompt and Enter</p>
    <div class="w-4 h-4"><Svg icon="angles-down" /></div>
  {/if}
  {#if loading}
    <div class="absolute inset-0 flex-center">
      <ProgressRadial stroke={60} meter="stroke-primary-500" track="stroke-primary-500/30" />
    </div>
  {/if}
</div>
