<script lang="ts">
  import { onMount } from 'svelte'
  import { FileDropzone } from '@skeletonlabs/skeleton'
  import Svg from '$lib/svelte/Svg.svelte'
  import { getBlob } from '$lib/ts/utils'

  export let display: boolean
  export let file: File | Blob | null // bind
  export let resImg: Blob | undefined

  let dom: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null = null
  let image: HTMLImageElement | undefined = undefined
  let range: number = 1
  let click: boolean = false
  let center: number[] | undefined = undefined

  onMount(() => {
    ctx = dom.getContext('2d')
  })
  const pointerDown = async (e: PointerEvent) => {
    if (!(e.currentTarget instanceof Element)) throw new Error('e.currentTarget is not Element')
    if (!ctx) throw new Error('There is no Context2d')
    e.currentTarget.setPointerCapture(e.pointerId)
    click = true
    file = await getBlob(dom, undefined, 1)
  }
  const pointerUp = async (e: PointerEvent) => {
    if (!(e.currentTarget instanceof Element)) throw new Error('e.currentTarget is not Element')
    e.currentTarget.releasePointerCapture(e.pointerId)
    click = false
    file = await getBlob(dom, undefined, 1)
  }
  const pointerMove = (e: PointerEvent) => {
    if (!click || !image) return
    if (!ctx) throw new Error('There is no Context2d')
    draw(e.movementX, e.movementY)
  }

  $: {
    draw(0, 0, range)
  }
  const handleRange = async () => {
    file = await getBlob(dom, undefined, 1)
  }

  const draw = (dx: number = 0, dy: number = 0, r: number = 1) => {
    if (ctx && image) {
      const imgWH = [image.width, image.height]
      const isVertical = dom.width / dom.height > imgWH[0] / imgWH[1]
      const baseScale = isVertical ? dom.width / imgWH[0] : dom.height / imgWH[1]
      const r1 = range - 1
      const scale = baseScale * (r1 * r1 + 1)
      const canvasScale = dom.clientWidth === 0 ? 1 : dom.clientWidth / dom.width
      const moveXY = [dx / scale / canvasScale, dy / scale / canvasScale]
      const oldCenter = center ? center : [imgWH[0] / 2, imgWH[1] / 2]
      const newCenter = [oldCenter[0] - moveXY[0], oldCenter[1] - moveXY[1]]
      const area = [
        newCenter[0] - dom.width / 2 / scale,
        newCenter[1] - dom.height / 2 / scale,
        newCenter[0] + dom.width / 2 / scale,
        newCenter[1] + dom.height / 2 / scale,
      ]
      const fixMoveXY = [0, 0]
      if (area[0] < 0) fixMoveXY[0] = -area[0]
      if (area[1] < 0) fixMoveXY[1] = -area[1]
      if (area[2] > imgWH[0]) fixMoveXY[0] = imgWH[0] - area[2]
      if (area[3] > imgWH[1]) fixMoveXY[1] = imgWH[1] - area[3]
      area[0] += fixMoveXY[0]
      area[1] += fixMoveXY[1]
      area[2] += fixMoveXY[0]
      area[3] += fixMoveXY[1]
      center = [(area[0] + area[2]) / 2, (area[1] + area[3]) / 2]
      const s = [area[0], area[1], area[2] - area[0], area[3] - area[1]]
      const d = [0, 0, dom.width, dom.height]
      ctx.drawImage(image, s[0], s[1], s[2], s[3], d[0], d[1], d[2], d[3])
    }
  }

  const imageUpdate = (obj: Blob | MediaSource | undefined) => {
    if (!obj) deleteFile()
    else {
      image = new Image()
      image.onload = async () => {
        if (!image) throw new Error('no image')
        const wh = image.height > image.width ? image.width : image.height
        dom.width = wh < 512 ? wh : 512
        dom.height = wh < 512 ? wh : 512
        draw()
        file = await getBlob(dom, undefined, 1)
        URL.revokeObjectURL(image.src)
      }
      image.src = URL.createObjectURL(obj)
    }
  }
  const uploadFile = (e: Event) => {
    if (!(e.target instanceof HTMLInputElement)) throw new Error('e.target is not HTMLInputElement')
    imageUpdate(e.target.files?.[0])
    e.target.value = ''
  }
  const deleteFile = () => {
    file = null
    image = undefined
    ctx?.clearRect(0, 0, dom.width, dom.height)
    range = 1
    center = undefined
  }
</script>

<div class="relative w-full h-full {display ? 'block' : 'hidden'}">
  <canvas
    class="{file ? 'block' : 'hidden'} max-w-full w-full touch-none cursor-grab active:cursor-grabbing"
    bind:this={dom}
    on:pointerdown={pointerDown}
    on:pointerup={pointerUp}
    on:pointermove={pointerMove}
  />
  <div class="{!file ? 'flex' : 'hidden'} flex-col justify-center items-center h-full mx-6">
    <button
      type="button"
      class="{!file && resImg ? 'flex' : 'hidden'} btn variant-filled-surface mb-6"
      on:click={() => imageUpdate(resImg)}
    >
      <div class="inline-block w-4 h-4 mr-2 flex-center"><Svg icon="file-arrow-up" /></div>
      Insert result image
    </button>
    <FileDropzone name="files" on:change={uploadFile}>
      <svelte:fragment slot="lead">
        <div class="w-8 h-8 mx-auto flex-center"><Svg icon="file-arrow-up" /></div>
      </svelte:fragment>
      <svelte:fragment slot="message"><b>Upload a file</b> or drag and drop</svelte:fragment>
    </FileDropzone>
  </div>
  <div class="absolute right-0 left-0 bottom-0 h-[43px] flex-center">
    <div class="w-52 h-[43px] flex-center variant-filled-surface rounded-full {file ? 'opacity-100' : 'opacity-50'}">
      <input
        type="range"
        class="w-32 scale-150 cursor-pointer disabled:cursor-not-allowed"
        min="1"
        max="2.5"
        step=".01"
        disabled={!file}
        bind:value={range}
        on:change={handleRange}
      />
    </div>
    <button
      type="button"
      class="absolute right-0 bottom-0 btn-icon variant-filled-surface p-2"
      disabled={!file}
      on:click={deleteFile}
    >
      <Svg icon="trash-can" />
    </button>
  </div>
</div>
