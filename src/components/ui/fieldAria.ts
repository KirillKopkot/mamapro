import type { FieldMessages } from './Field'

/** Атрибуты доступности для поля с подсказкой/ошибкой. */
export function fieldAria(
  id: string,
  { hint, error }: Pick<FieldMessages, 'hint' | 'error'>,
) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  }
}
