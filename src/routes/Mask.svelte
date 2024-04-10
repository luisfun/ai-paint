<script lang="ts">
  import { onMount } from 'svelte'
  import Svg from '$lib/svelte/Svg.svelte'

  const color = 'rgba(0, 255, 0, 1)'
  const lineWidth = 32

  export let display: boolean
  export let mask: Blob | null // bind
  export let fileUrl: string
  $: if (fileUrl !== '') {
    const image = new Image()
    image.onload = () => {
      const isVertical = image.height > image.width
      const wh = isVertical ? image.width : image.height
      dom.width = wh
      dom.height = wh
    }
    image.src = fileUrl
  } else {
    canvasClear()
  }

  let dom: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null = null
  let scale: number = 1
  let click: boolean = false

  onMount(() => {
    ctx = dom.getContext('2d')
  })
  const pointerDown = async (e: PointerEvent) => {
    if (!(e.currentTarget instanceof Element)) throw new Error('e.currentTarget is not Element')
    if (!ctx) throw new Error('There is no Context2d')
    e.currentTarget.setPointerCapture(e.pointerId)
    click = true
    // draw start
    scale = dom.width / dom.clientWidth
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth * scale
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(e.offsetX * scale, e.offsetY * scale)
    ctx.lineTo(e.offsetX * scale, e.offsetY * scale)
    ctx.stroke()
    mask = await getBlob(dom, undefined, 1)
  }
  const pointerUp = async (e: PointerEvent) => {
    if (!(e.currentTarget instanceof Element)) throw new Error('e.currentTarget is not Element')
    e.currentTarget.releasePointerCapture(e.pointerId)
    click = false
    mask = await getBlob(dom, undefined, 1)
  }
  const pointerMove = (e: PointerEvent) => {
    if (!click) return
    if (!ctx) throw new Error('There is no Context2d')
    // draw
    ctx.lineTo(e.offsetX * scale, e.offsetY * scale)
    ctx.stroke()
  }
  const canvasClear = () => {
    ctx?.clearRect(0, 0, dom.width, dom.height)
    mask = null
  }
  const getBlob = (canvas: HTMLCanvasElement, type?: string, quality?: number) =>
    new Promise((resolve: (value: Blob | null) => void) => canvas.toBlob(resolve, type, quality))
</script>

<div class="relative w-full h-full {display ? 'block' : 'hidden'}">
  <img class="absolute w-full h-full object-cover" src={fileUrl} alt="Upload" />
  <div class="absolute w-full h-full bg-black/50 flex-col justify-center items-center {mask ? 'hidden' : 'flex'}">
    <p>
      Without filling, the entire image is modified.<br />
      With filling, only the filled area is modified.
    </p>
  </div>
  <canvas
    class="absolute w-full h-full opacity-75 touch-none"
    bind:this={dom}
    on:pointerdown={pointerDown}
    on:pointerup={pointerUp}
    on:pointermove={pointerMove}
  />
  <button
    type="button"
    class="absolute right-0 bottom-0 btn-icon variant-filled-surface p-2"
    disabled={!mask}
    on:click={canvasClear}
  >
    <Svg icon="trash-can" />
  </button>
</div>
