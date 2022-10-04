import { Schema, SchemaType } from 'mongoose'

const buildvalue = (raw: any, type: SchemaType) => {
  if (type.instance === 'Number') {
    return Number(raw)
  }
  return raw
}

type RawOption = {
  key: string
  value: string
}

export function toMongoFilters<T>({ value }: { value: RawOption[] }): {
  [key: string]: any
} {
  const $this = this as Schema<T>

  const _filter = {}

  $this.eachPath((path, type) => {
    if (value.findIndex((e) => e.key === path) > -1) {
      _filter[path] = buildvalue(path, type)
    }
  })

  console.log(_filter)

  return _filter
}
