export const recreateURL = (url: string, obj: Blob | MediaSource | '') => {
  if (url) URL.revokeObjectURL(url)
  if (obj === '') return obj
  else return URL.createObjectURL(obj)
}
