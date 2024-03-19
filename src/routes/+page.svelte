<script lang="ts">
  import { onMount } from 'svelte'
  import { FileDropzone, ProgressRadial, RadioGroup, RadioItem } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import AdSense from '$lib/svelte/AdSense.svelte'
  import Turnstile from '$lib/svelte/Turnstile.svelte'
  import { adsense, turnstileSitekey } from '$lib/config'

  onMount(() => {
    const url = new URL(window.location.toString())
    const auth = url.searchParams.get('auth')
    if (auth) {
      document.cookie = `shared_auth_key=${auth}; path=/; max-age=${60 * 60 * 24 * 31}`
      url.searchParams.delete('auth')
      history.replaceState({}, '', url)
    }
  })

  const tabIcons = ['file-arrow-up', 'crop-simple', 'image'] as const

  let tab = 2
  let file: File | Blob | undefined = undefined
  let fileUrl = ''
  let mask: Blob | undefined = undefined
  let prompt = ''
  let resImg: Blob | undefined = undefined
  let resImgUrl = ''
  let loading = false
  let error = 200
  let adDisplay = false

  const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    file = target.files?.[0]
    target.value = ''
    if (!file) fileUrl = ''
    else {
      if (fileUrl) URL.revokeObjectURL(fileUrl)
      fileUrl = URL.createObjectURL(file)
    }
  }
  const replaseFile = () => {
    if (resImg && resImgUrl) {
      file = resImg
      fileUrl = resImgUrl
    }
  }
  const deleteFile = () => {
    file = undefined
    fileUrl = ''
  }

  const submit = async () => {
    if (loading) return null
    loading = true
    tab = 2
    const body = new FormData()
    if (file) {
      body.append('file', file)
      if (mask) body.append('mask', mask)
    }
    body.append('prompt', prompt)
    const res = await fetch('/api/image', { method: 'POST', body })
    error = res.status
    if (res.ok) {
      if (resImgUrl) URL.revokeObjectURL(resImgUrl)
      resImg = await res.blob()
      resImgUrl = URL.createObjectURL(resImg)
    } else resImgUrl = ''
    loading = false
    if (res.headers.get('X-Auth') !== 'true') adDisplay = true
  }
</script>

<div class="relative w-[512px] aspect-square max-w-full my-4 mx-auto flex-center">
  {#if tab === 0}
    <div class="w-full h-2/3">
      {#if fileUrl}
        <img src={fileUrl} alt="Upload" />
      {:else if resImg && resImgUrl}
        <button type="button" class="btn variant-filled-surface m-auto p-2" on:click={replaseFile}>
          <Svg icon="file-arrow-up" /> Insert result image
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
  {:else if tab === 1}
    <div />
  {:else if tab === 2}
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
<div class="flex-center my-4">
  <RadioGroup active="variant-filled-surface">
    {#each tabIcons as icon, i}
      <RadioItem name="tab" bind:group={tab} value={i} disabled={i === 1 && !file}>
        <div class="w-4 h-4 flex-center"><Svg {icon} /></div>
      </RadioItem>
    {/each}
  </RadioGroup>
</div>
<form class="input-group grid-cols-[1fr_auto] my-4 mx-auto" on:submit|preventDefault={submit}>
  <input type="text" placeholder="Prompt" bind:value={prompt} />
  <button type="submit" class="input-group-shim bg-inherit" aria-label="Generate">
    <Svg icon="paint" />
  </button>
</form>
<Turnstile sitekey={turnstileSitekey} />
<AdSense enabled={adDisplay} {adsense} />

<style>
  :global(.radio-item) {
    padding: 0.25rem 0.75rem;
  }
  .input-group button {
    padding: 0.5rem;
  }
</style>
