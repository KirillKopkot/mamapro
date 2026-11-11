import type { Child, ChildSection, ChildView } from '../types'

/** Оставляет в представлении только разрешённые разделы. Имя и возраст не раскрываются никогда. */
export function pickSections(child: Child, sections: readonly ChildSection[]): ChildView {
  const view: ChildView = { childId: child.id }
  if (sections.includes('features')) view.features = child.features
  if (sections.includes('manifestations')) view.manifestations = child.manifestations
  if (sections.includes('whatHelps')) view.whatHelps = child.whatHelps
  if (sections.includes('stressTriggers')) view.stressTriggers = child.stressTriggers
  if (sections.includes('documents')) view.documents = child.documents
  return view
}
