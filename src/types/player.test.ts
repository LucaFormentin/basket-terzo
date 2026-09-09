import { describe, expect, it } from 'vitest'
import { PlayerFinesListSchema } from './player'

const fine = {
  _id: 'fine-1',
  fineId: 'catalog-1',
  name: 'Ritardo',
  penitence: '10 €',
  date: '2026-09-09',
  paid: false,
}

describe('PlayerFinesListSchema', () => {
  it('normalizes legacy arrays', () => {
    expect(PlayerFinesListSchema.parse([fine])).toEqual([fine])
  })

  it('normalizes keyed records', () => {
    expect(PlayerFinesListSchema.parse({ [fine._id]: fine })).toEqual([fine])
  })

  it('normalizes missing collections to an empty array', () => {
    expect(PlayerFinesListSchema.parse(undefined)).toEqual([])
    expect(PlayerFinesListSchema.parse(null)).toEqual([])
  })
})
