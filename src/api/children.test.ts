import { beforeEach, describe, expect, it } from 'vitest'
import { getAccessGrants, saveAccessGrant } from './access'
import { deleteChild, getChildForSpecialist, getChildren, saveChild } from './children'
import { clearChildDraft, getChildDraft, saveChildDraft } from './childDrafts'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  apiConfig.delayMs = 0
})

const base = {
  name: 'Секретное имя',
  age: 7,
  features: 'F-secret',
  manifestations: 'M-secret',
  whatHelps: 'H-secret',
  stressTriggers: 'S-secret',
  documents: [{ id: 'd1', name: 'doc.pdf' }],
}

describe('getChildForSpecialist', () => {
  it('returns nothing without a grant', async () => {
    const child = await saveChild(base)
    expect(await getChildForSpecialist(child.id, 'sp-1')).toBeNull()
  })

  it('returns only granted sections and never name or age', async () => {
    const child = await saveChild(base)
    await saveAccessGrant({
      childId: child.id,
      specialistId: 'sp-1',
      sections: ['whatHelps', 'documents'],
    })
    const view = await getChildForSpecialist(child.id, 'sp-1')
    expect(view).toEqual({
      childId: child.id,
      whatHelps: 'H-secret',
      documents: base.documents,
    })
    const json = JSON.stringify(view)
    expect(json).not.toContain('Секретное имя')
    expect(json).not.toContain('F-secret')
    expect(json).not.toContain('S-secret')
    expect(view).not.toHaveProperty('name')
    expect(view).not.toHaveProperty('age')
  })

  it('does not leak access to another specialist or another child', async () => {
    const child = await saveChild(base)
    const other = await saveChild({ ...base, name: 'Другой' })
    await saveAccessGrant({
      childId: child.id,
      specialistId: 'sp-1',
      sections: ['features'],
    })
    expect(await getChildForSpecialist(child.id, 'sp-2')).toBeNull()
    expect(await getChildForSpecialist(other.id, 'sp-1')).toBeNull()
  })
})

describe('deleteChild', () => {
  it('removes the child, its grants and its draft only', async () => {
    const a = await saveChild(base)
    const b = await saveChild({ ...base, name: 'B' })
    await saveAccessGrant({ childId: a.id, specialistId: 'sp-1', sections: ['features'] })
    await saveAccessGrant({ childId: b.id, specialistId: 'sp-1', sections: ['features'] })
    const draft = {
      name: 'x',
      age: '1',
      features: '',
      manifestations: '',
      whatHelps: '',
      stressTriggers: '',
    }
    await saveChildDraft(a.id, draft)
    await saveChildDraft(b.id, draft)

    await deleteChild(a.id)

    expect((await getChildren()).map((c) => c.id)).toEqual([b.id])
    expect((await getAccessGrants()).map((g) => g.childId)).toEqual([b.id])
    expect(await getChildDraft(a.id)).toBeNull()
    expect(await getChildDraft(b.id)).toEqual(draft)
    expect(await getChildForSpecialist(a.id, 'sp-1')).toBeNull()
  })
})

describe('drafts', () => {
  it('saves and clears a draft', async () => {
    const draft = {
      name: 'n',
      age: '5',
      features: 'f',
      manifestations: '',
      whatHelps: '',
      stressTriggers: '',
    }
    await saveChildDraft('new', draft)
    expect(await getChildDraft('new')).toEqual(draft)
    await clearChildDraft('new')
    expect(await getChildDraft('new')).toBeNull()
  })
})
