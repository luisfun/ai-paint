<script lang="ts">
  import { onMount } from 'svelte'
  import { afterNavigate } from '$app/navigation'
  import { ProgressRadial } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import AdSense from '$lib/svelte/AdSense.svelte'
  import Turnstile from '$lib/svelte/Turnstile.svelte'
  import { adsense, turnstileSitekey } from '$lib/config'

  onMount(() => {
    const url = new URL(window.location.toString())
    const auth = url.searchParams.get('auth')
    if (auth) {
      document.cookie = `shared_auth_key=${auth}; path=/; max-age=${60 * 60 * 24 * 30}`
      url.searchParams.delete('auth')
      history.replaceState({}, '', url)
    }
  })

  afterNavigate(() => {
    document.querySelector('input')?.focus()
  })

  const models = ['dreamshaper-8-lcm', 'stable-diffusion-xl-lightning']

  let prompt = ''
  let model = models[0]
  let imageUrl = ''
  let loading = false
  let error = 200
  let adDisplay = false

  const submit = async (event: Event) => {
    event.preventDefault()
    if (loading) return null
    loading = true
    const res = await fetch(`/api/t2i?model=${model}&prompt=${prompt}`)
    error = res.status
    if (res.ok) {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
      imageUrl = URL.createObjectURL(await res.blob())
    }
    else imageUrl = ''
    loading = false
    if (res.headers.get('X-Auth') !== 'true') adDisplay = true
  }
</script>

<div class="relative w-[512px] aspect-square max-w-full my-4 mx-auto flex-center">
  {#if imageUrl}
    <img class="max-w-full h-auto {loading ? 'opacity-50' : ''}" src={imageUrl} alt="Generated" />
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
<form class="input-group grid-cols-[1fr_auto] my-4 mx-auto" on:submit={submit}>
  <input type="text" placeholder="Prompt" bind:value={prompt} />
  <button type="submit" class="input-group-shim bg-inherit" aria-label="Generate">
    <Svg icon="paint" />
  </button>
</form>
<Turnstile sitekey={turnstileSitekey} />
<AdSense enabled={adDisplay} {adsense} />

<style>
  .input-group button {
    padding: 0.5rem;
  }
</style>
