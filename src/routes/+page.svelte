<script lang="ts">
  import { onMount } from 'svelte'
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import { Turnstile } from 'svelte-turnstile'
  import { turnstileSiteKey } from '$lib/config'
  import Svg from '$lib/svelte/Svg.svelte'
  import AdSense from '$lib/svelte/AdSense.svelte'

  onMount(() => {
    const url = new URL(window.location.toString())
    const auth = url.searchParams.get('auth')
    if (auth) {
      document.cookie = `shared_auth_key=${auth}; path=/; max-age=${60 * 60 * 24 * 30}`
      url.searchParams.delete('auth')
      history.replaceState({}, '', url)
    }
  })

  const models = ['dreamshaper-8-lcm', 'stable-diffusion-xl-lightning']

  let imageUrl = ''
  let loading = false
  let error = 200
  let adsense = false

  const submit = async (event: Event) => {
    event.preventDefault()
    if (loading) return null
    loading = true
    const body = new FormData(event.target as HTMLFormElement)
    const res = await fetch('/api/t2i', { method: 'POST', body })
    error = res.status
    if (res.ok) imageUrl = URL.createObjectURL(await res.blob())
    else imageUrl = ''
    loading = false
    if (res.headers.get('X-Auth') !== 'true') adsense = true
  }
</script>

<form on:submit={submit} method="POST">
  <div class="relative w-[512px] aspect-square max-w-full my-4 mx-auto flex-center">
    <div class="absolute inset-0 flex-center z-10000 {imageUrl || loading || error !== 200 ? 'opacity-0' : ''}">
      <Turnstile siteKey={turnstileSiteKey} />
    </div>
    {#if imageUrl}
      <img class="max-w-full h-auto {loading ? 'opacity-50' : ''}" src={imageUrl} alt="Generated" />
    {:else if error !== 200}
      <div class="flex-center">
        <b>Error: {error}</b>
        <p>Please try to generate it again</p>
      </div>
    {:else if !loading}
      <div class="flex-center">
        <p>Type Prompt and Enter</p>
        <p>↓</p>
      </div>
    {/if}
    {#if loading}
      <div class="absolute inset-0 flex-center">
        <ProgressRadial />
      </div>
    {/if}
  </div>
  <div class="input-group grid-cols-[1fr_auto] my-4 mx-auto">
    <input id="prompt" type="text" placeholder="Prompt" />
    <button type="submit" class="btn-icon">
      <Svg icon="paint" />
    </button>
  </div>
</form>
<AdSense enabled={adsense} />

<style>
  p {
    margin: 0.5rem 0;
  }
</style>
