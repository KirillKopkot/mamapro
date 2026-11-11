import type { City, LocalizedText } from '../types'

/** Список городов. Чтобы добавить город, расширьте тип City и этот список. */
export const cities: readonly { id: City; name: LocalizedText }[] = [
  { id: 'astana', name: { ru: 'Астана', kk: 'Астана' } },
  { id: 'almaty', name: { ru: 'Алматы', kk: 'Алматы' } },
]
