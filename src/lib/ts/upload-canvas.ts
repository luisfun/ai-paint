export class UploadCanvas {
  #dom: HTMLCanvasElement | undefined = undefined
  #ctx: CanvasRenderingContext2D | undefined = undefined
  #canvasHW = [512, 512]
  #img: HTMLImageElement | undefined = undefined
  #imgArea: number[] | undefined = undefined
  #imgScale: number = 1
  constructor() {}
  /*
  constructor(dom: HTMLCanvasElement) {
    this.#dom = dom
    const ctx = dom.getContext(`2d`)
    if (!ctx) throw new Error('no Canvas Context')
    this.#ctx = ctx
  }
  */
  set bind(dom: HTMLCanvasElement) {
    this.#dom = dom
    const ctx = dom.getContext(`2d`)
    if (!ctx) throw new Error('no Canvas Context')
    this.#ctx = ctx
  }

  // blob -> bitmap -> drawImage は可能だが、Safariが非対応 - https://insider.10bace.com/2021/12/24/render-blob-on-canvas/
  uploadImage(src: string) {
    this.#img = new Image()
    this.#img.onload = () => {
      this.#draw()
    }
    this.#img.onerror = () => {
      console.warn('Image Load Error')
      this.deleteImage()
    }
    this.#img.src = src
  }

  deleteImage() {
    this.#img = undefined
    this.#imgArea = undefined
    this.#imgScale = 1
    this.#draw()
  }

  onMove(xy: number[]) {
    if (!this.#dom || !this.#img) throw new Error('no Image')
    const imgWH = [this.#img.width, this.#img.height]
    const isVertical = this.#canvasHW[0] / this.#canvasHW[1] > imgWH[0] / imgWH[1]
    const baseScale = isVertical ? this.#canvasHW[0] / imgWH[0] : this.#canvasHW[1] / imgWH[1]
    const scale = baseScale * this.#imgScale
    const canvasScale = this.#dom.clientWidth / this.#canvasHW[0]
    const moveXY = [xy[0] / scale / canvasScale, xy[1] / scale / canvasScale]
    const oldImgCenter = [
      this.#imgArea ? (this.#imgArea[0] + this.#imgArea[2]) / 2 : imgWH[0] / 2,
      this.#imgArea ? (this.#imgArea[1] + this.#imgArea[3]) / 2 : imgWH[1] / 2,
    ]
    const newImgCenter = [oldImgCenter[0] - moveXY[0], oldImgCenter[1] - moveXY[1]]
    const newImgArea = [
      newImgCenter[0] - this.#canvasHW[0] / 2 / scale,
      newImgCenter[1] - this.#canvasHW[1] / 2 / scale,
      newImgCenter[0] + this.#canvasHW[0] / 2 / scale,
      newImgCenter[1] + this.#canvasHW[1] / 2 / scale,
    ]
    const addMoveXY = [0, 0]
    if (newImgArea[0] < 0) addMoveXY[0] = -newImgArea[0]
    if (newImgArea[1] < 0) addMoveXY[1] = -newImgArea[1]
    if (newImgArea[2] > imgWH[0]) addMoveXY[0] = imgWH[0] - newImgArea[2]
    if (newImgArea[3] > imgWH[1]) addMoveXY[1] = imgWH[1] - newImgArea[3]
    newImgArea[0] += addMoveXY[0]
    newImgArea[1] += addMoveXY[1]
    newImgArea[2] += addMoveXY[0]
    newImgArea[3] += addMoveXY[1]
    this.#imgArea = newImgArea
    this.#draw()
  }

  onScale(scale: number) {
    this.#imgScale = scale
    this.onMove([0, 0])
  }

  getBlob() {
    if (this.#dom && this.#ctx && this.#img && this.#imgArea)
      // @ts-expect-error
      return new Promise((resolve: (value: Blob | null) => void) => this.#dom.toBlob(resolve, undefined, 1))
    return null
  }

  #draw() {
    if (this.#dom && this.#ctx && this.#img && this.#imgArea) {
      const s = [
        this.#imgArea[0],
        this.#imgArea[1],
        this.#imgArea[2] - this.#imgArea[0],
        this.#imgArea[3] - this.#imgArea[1],
      ]
      const d = [0, 0, this.#canvasHW[0], this.#canvasHW[1]]
      this.#ctx.drawImage(this.#img, s[0], s[1], s[2], s[3], d[0], d[1], d[2], d[3])
      this.#dom.style.opacity = '1'
    } else {
      if (this.#dom) this.#dom.style.opacity = '0'
    }
  }
}
