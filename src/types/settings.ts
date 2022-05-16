export type ResourceStatSetting = {
  name: string
  label: string
  color: string
}
export type Settings = Partial<{
  path: string
  resourceStats: ResourceStatSetting[]
}>
