<script lang="ts">
  import { onMount } from 'svelte'
  import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import AdSense from '$lib/svelte/AdSense.svelte'
  import Turnstile from '$lib/svelte/Turnstile.svelte'
  import { adsense, turnstileSitekey } from '$lib/config'
  import Upload from './Upload.svelte'
  import Mask from './Mask.svelte'
  import Result from './Result.svelte'

  onMount(() => {
    const url = new URL(window.location.toString())
    const auth = url.searchParams.get('auth')
    if (auth) {
      document.cookie = `shared_auth_key=${auth}; path=/; max-age=${60 * 60 * 24 * 31}`
      url.searchParams.delete('auth')
      history.replaceState({}, '', url)
    }
    const navLang = window.navigator.language.split('-')[0]
    if (navLang && navLang.slice(0, 2).toLocaleLowerCase() !== 'en') languages = [...languages, navLang]
  })

  const tabIcons = ['adjustments-horizontal', 'file-arrow-up', 'crop-simple', 'image'] as const
  let languages = ['en']

  let tab = 3
  let steps = 0
  let strength = 1
  let guidance = 7.5
  let file: Blob | null = null
  let mask: Blob | null = null
  let lang = languages[0]
  let prompt = ''
  let resImg: Blob | undefined = undefined
  let mode = 'Text to Image'
  let loading = false
  let error = 200
  let adDisplay = false

  // prettier-ignore
  $: !file ? (mode = 'Text to Image') :
     !mask ? (mode = 'Image to Image') :
     (mode = 'Inpainting')

  const submit = async () => {
    if (loading) return null
    loading = true
    tab = 3
    const body = new FormData()
    body.append('steps', steps.toString())
    body.append('strength', strength.toString())
    body.append('guidance', guidance.toString())
    if (file) {
      body.append('file', file)
      if (mask) body.append('mask', mask)
    }
    body.append('lang', lang)
    body.append('prompt', prompt)
    const res = await fetch('/api/image', { method: 'POST', body })
    error = res.status
    if (res.ok) resImg = await res.blob()
    else resImg = undefined
    tab = 3
    loading = false
    if (res.headers.get('X-Auth') !== 'true') adDisplay = true
  }
</script>

<div class="relative w-[512px] aspect-square max-w-full my-4 mx-auto flex-center">
  <div class="w-64 max-w-full {tab === 0 ? 'block' : 'hidden'}">
    <p class="text-center">{mode}</p>
    <hr />
    <!--
      <p>Steps: {steps}</p>
      <input type="range" max="20" bind:value={steps} disabled />
      -->
    <p>Strength: {strength}</p>
    <input type="range" class="cursor-pointer" max="1" step=".05" bind:value={strength} />
    <!--
      <p>Guidance: {guidance}</p>
      <input type="range" max="15" step=".5" bind:value={guidance} />
      -->
  </div>
  <Upload display={tab === 1} bind:file {resImg} />
  <Mask display={tab === 2} bind:mask {file} />
  <Result display={tab === 3} {resImg} {error} {loading} />
</div>
<form class="input-group input-group-divider grid-cols-[auto_1fr_auto] mt-4 mx-auto" on:submit|preventDefault={submit}>
  <select class="cursor-pointer" bind:value={lang} aria-label="Gelect Language">
    {#each languages as la}
      <option value={la}>{la.slice(0, 2).toUpperCase()}</option>
    {/each}
  </select>
  <input type="text" placeholder="Prompt" bind:value={prompt} />
  <button type="submit" class="input-group-shim bg-inherit" aria-label="Generate" disabled={!prompt}>
    <Svg icon="paint" />
  </button>
</form>
<div class="mb-4 flex justify-center">
  <RadioGroup active="variant-filled-surface" border="">
    {#each tabIcons as icon, i}
      {#if !((i === 0 || i === 2) && !file)}
        <RadioItem name="tab" label={icon} bind:group={tab} value={i} disabled={(i === 0 || i === 2) && !file}>
          <div class="w-4 h-4 flex-center"><Svg {icon} /></div>
        </RadioItem>
      {/if}
    {/each}
  </RadioGroup>
</div>
<Turnstile sitekey={turnstileSitekey} />
<AdSense enabled={adDisplay} {adsense} />

<style>
  :global(.input-group select) {
    background-image: none;
    padding-right: 0.5rem;
  }
  :global(.radio-group) {
    border-radius: 0 0 1rem 1rem;
  }
  :global(.radio-item) {
    padding: 0.25rem 0.75rem;
  }
  .input-group button {
    padding: 0.5rem;
  }
</style>
