import { describe, expect, it } from 'vitest'
import { calculateCashFlow } from './Cash'

const fine = (penitence: string, paid: boolean, id: string) => ({
  _id: id,
  fineId: `catalog-${id}`,
  name: `Multa ${id}`,
  penitence,
  date: '2026-09-09',
  paid,
})

describe('calculateCashFlow', () => {
  it('derives totals from paid and unpaid fines across players', () => {
    const result = calculateCashFlow([
      { finesList: [fine('10 €', false, '1'), fine('5 €', true, '2')] },
      { finesList: [fine('20 €', false, '3')] },
      { finesList: [] },
    ])

    expect(result).toEqual({ missing: 30, collected: 5, total: 35 })
  })

  it('ignores fines without a numeric amount', () => {
    expect(
      calculateCashFlow([{ finesList: [fine('Penitenza', false, '1')] }])
    ).toEqual({ missing: 0, collected: 0, total: 0 })
  })
})
