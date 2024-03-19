export const objURL = (src: string, obj: Blob | MediaSource | "") => {
  if (src) URL.revokeObjectURL(src)
  if (obj === "") return obj
  else return URL.createObjectURL(obj)
}
