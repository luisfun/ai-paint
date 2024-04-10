<script lang="ts">
  import { FileDropzone } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import { recreateURL } from '$lib/ts/recreate-url'

  export let display: boolean
  export let file: File | Blob | undefined // bind
  export let fileUrl: string // bind
  $: if (file) fileUrl = recreateURL(fileUrl, file)
  else fileUrl = recreateURL(fileUrl, '')
  export let resImg: Blob | undefined

  const uploadFile = (event: Event) => {
    const target = event.target as HTMLInputElement
    file = target.files?.[0]
    target.value = ''
  }
  const insertBlob = () => {
    if (resImg) file = new Blob([resImg])
  }
  const deleteFile = () => (file = undefined)
</script>

<div class="w-full h-full {display ? 'block' : 'hidden'}">
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
</div>
