export const recreateURL = (url: string, obj: Blob | MediaSource | '') => {
  if (url) URL.revokeObjectURL(url)
  if (obj === '') return obj
  else return URL.createObjectURL(obj)
}

export const getBlob = (canvas: HTMLCanvasElement, type?: string, quality?: number) =>
  new Promise((resolve: (value: Blob | null) => void) => canvas.toBlob(resolve, type, quality))
