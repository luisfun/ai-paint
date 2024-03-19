export const ImgSrc = class {
  #src = ""
  constructor(init?: string) {
    if (init) this.#src = init
  }
  set = (obj: Blob | MediaSource | string) => {
    if (this.#src) URL.revokeObjectURL(this.#src)
    if (obj instanceof Blob || obj instanceof MediaSource) this.#src = URL.createObjectURL(obj)
    if (typeof obj === "string") this.#src = obj
  }
  get src() {
    return this.#src
  }
}
