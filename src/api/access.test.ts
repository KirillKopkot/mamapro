import { beforeEach, describe, expect, it } from 'vitest'
import { getAccessGrants, revokeAccessGrant, saveAccessGrant } from './access'
import { apiConfig } from './storage'

beforeEach(() => {
  localStorage.clear()
  apiConfig.delayMs = 0
})

describe('access grants', () => {
  it('saves a grant and replaces it for the same pair', async () => {
    await saveAccessGrant({ childId: 'c1', specialistId: 'sp-1', sections: ['features'] })
    await saveAccessGrant({
      childId: 'c1',
      specialistId: 'sp-1',
      sections: ['features', 'whatHelps'],
    })
    const grants = await getAccessGrants('c1')
    expect(grants).toHaveLength(1)
    expect(grants[0]?.sections).toEqual(['features', 'whatHelps'])
  })

  it('filters by child', async () => {
    await saveAccessGrant({
      childId: 'c1',
      specialistId: 'sp-1',
      sections: ['documents'],
    })
    await saveAccessGrant({
      childId: 'c2',
      specialistId: 'sp-1',
      sections: ['documents'],
    })
    expect(await getAccessGrants('c2')).toHaveLength(1)
    expect(await getAccessGrants()).toHaveLength(2)
  })

  it('revokes only the given pair', async () => {
    await saveAccessGrant({ childId: 'c1', specialistId: 'sp-1', sections: ['features'] })
    await saveAccessGrant({ childId: 'c1', specialistId: 'sp-2', sections: ['features'] })
    const left = await revokeAccessGrant('c1', 'sp-1')
    expect(left.map((g) => g.specialistId)).toEqual(['sp-2'])
  })

  it('treats empty sections as revoke', async () => {
    await saveAccessGrant({ childId: 'c1', specialistId: 'sp-1', sections: ['features'] })
    await saveAccessGrant({ childId: 'c1', specialistId: 'sp-1', sections: [] })
    expect(await getAccessGrants('c1')).toEqual([])
  })
})
