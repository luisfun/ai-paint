<script lang="ts">
  import { onMount } from 'svelte'
  import { FileDropzone, ProgressRadial, RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import AdSense from '$lib/svelte/AdSense.svelte'
  import Turnstile from '$lib/svelte/Turnstile.svelte'
  import { adsense, turnstileSitekey } from '$lib/config'
  import { objURL } from '$lib/ts/obj-url'

  onMount(() => {
    const url = new URL(window.location.toString())
    const auth = url.searchParams.get('auth')
    if (auth) {
      document.cookie = `shared_auth_key=${auth}; path=/; max-age=${60 * 60 * 24 * 31}`
      url.searchParams.delete('auth')
      history.replaceState({}, '', url)
    }
  })

  const tabIcons = ['adjustments-horizontal', 'file-arrow-up', 'crop-simple', 'image'] as const
  const langs = ['en', ...['es', 'fr', 'ar', 'ru', 'zh', 'ja', 'ko'].sort()]

  let tab = 3
  let steps = 0
  let strength = 1
  let guidance = 7.5
  let file: File | Blob | undefined = undefined
  let fileUrl = ''
  let mask: Blob | undefined = undefined
  let lang: (typeof langs)[number] = 'en'
  let prompt = ''
  let resImg: Blob | undefined = undefined
  let resImgUrl = ''
  let mode = 'Text to Image'
  let loading = false
  let error = 200
  let adDisplay = false

  // prettier-ignore
  $: !file ? (mode = 'Text to Image') :
     !mask ? (mode = 'Image to Image') :
     (mode = 'Inpainting')

  const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    file = target.files?.[0]
    target.value = ''
    if (!file) fileUrl = objURL(fileUrl, '')
    else fileUrl = objURL(fileUrl, file)
  }
  const insertBlob = () => {
    if (resImg && resImgUrl) {
      file = new Blob([resImg])
      fileUrl = objURL(fileUrl, file)
    }
  }
  const deleteFile = () => {
    file = undefined
    fileUrl = objURL(fileUrl, '')
  }

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
    if (res.ok) {
      resImg = await res.blob()
      resImgUrl = objURL(resImgUrl, resImg)
    } else resImgUrl = objURL(resImgUrl, '')
    tab = 3
    loading = false
    if (res.headers.get('X-Auth') !== 'true') adDisplay = true
  }
</script>

<div class="relative w-[512px] aspect-square max-w-full my-4 mx-auto flex-center">
  {#if tab === 0}
    <div class="w-64 max-w-full">
      <p class="text-center">{mode}</p>
      <hr />
      <p>Steps: {steps}</p>
      <input type="range" max="20" bind:value={steps} disabled />
      <p>Strength: {strength}</p>
      <input type="range" max="2" step=".05" bind:value={strength} />
      <p>Guidance: {guidance}</p>
      <input type="range" max="15" step=".5" bind:value={guidance} />
    </div>
  {:else if tab === 1}
    <div class="w-full h-2/3 flex-center">
      {#if fileUrl}
        <img src={fileUrl} alt="Upload" />
      {:else if resImg}
        <button type="button" class="btn variant-filled-surface" on:click={insertBlob}>
          <div class="inline-block w-4 h-4 mr-2 flex-center"><Svg icon="file-arrow-up" /></div>
          Insert result image
        </button>
      {/if}
    </div>
    <div class="flex w-full h-1/3 pt-4">
      <FileDropzone name="files" on:change={uploadFile}>
        <svelte:fragment slot="lead">
          <div class="w-8 h-8 mx-auto flex-center"><Svg icon="file-arrow-up" /></div>
        </svelte:fragment>
        <svelte:fragment slot="message"><b>Upload a file</b> or drag and drop</svelte:fragment>
      </FileDropzone>
      <button
        type="button"
        class="btn-icon variant-filled-surface ml-4 mt-auto p-2"
        disabled={!file}
        on:click={deleteFile}
      >
        <Svg icon="trash-can" />
      </button>
    </div>
  {:else if tab === 2}
    <div />
  {:else if tab === 3}
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
  {/if}
</div>
<form class="input-group input-group-divider grid-cols-[auto_1fr_auto] mt-4 mx-auto" on:submit|preventDefault={submit}>
  <select bind:value={lang}>
    {#each langs as la}
      <option value={la}>{la.toUpperCase()}</option>
    {/each}
  </select>
  <input type="text" placeholder="Prompt" bind:value={prompt} />
  <button type="submit" class="input-group-shim bg-inherit" aria-label="Generate">
    <Svg icon="paint" />
  </button>
</form>
<div class="mb-4 flex justify-center">
  <RadioGroup active="variant-filled-surface" border="">
    {#each tabIcons as icon, i}
      <RadioItem name="tab" bind:group={tab} value={i} disabled={i === 2 && !file}>
        <div class="w-4 h-4 flex-center"><Svg {icon} /></div>
      </RadioItem>
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
