import { beforeEach, describe, expect, it, vi } from 'vitest'

const firebase = vi.hoisted(() => ({
  get: vi.fn(),
  push: vi.fn(),
  ref: vi.fn((_db: unknown, path: string) => ({ path })),
  remove: vi.fn().mockResolvedValue(undefined),
  set: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('firebase/database', () => firebase)
vi.mock('@/lib/firebase/config', () => ({ database: {} }))

import { PlayerFinesC } from './Player'

const unpaidFine = {
  _id: 'fine-1',
  fineId: 'catalog-1',
  name: 'Ritardo',
  penitence: '10 €',
  date: '2026-09-09',
  paid: false,
}

const snapshot = (value: unknown) => ({
  exists: () => value !== null && value !== undefined,
  val: () => value,
})

describe('PlayerFinesC', () => {
  beforeEach(() => {
    process.env.FIREBASE_DB_COLLECTION = 'players'
    vi.clearAllMocks()
  })

  it('writes concurrent additions to distinct fine nodes', async () => {
    const player = new PlayerFinesC('player-1')
    const secondFine = { ...unpaidFine, _id: 'fine-2' }

    await Promise.all([player.addFine(unpaidFine), player.addFine(secondFine)])

    expect(firebase.set).toHaveBeenCalledTimes(2)
    expect(firebase.set).toHaveBeenCalledWith(
      { path: 'players/player-1/finesList/fine-1' },
      unpaidFine
    )
    expect(firebase.set).toHaveBeenCalledWith(
      { path: 'players/player-1/finesList/fine-2' },
      secondFine
    )
  })

  it('migrates and pays a legacy array entry with one multipath update', async () => {
    firebase.get.mockResolvedValue(snapshot({ finesList: [unpaidFine] }))
    const player = new PlayerFinesC('player-1')

    await player.convertToPaid('fine-1')

    expect(firebase.update).toHaveBeenCalledOnce()
    expect(firebase.update).toHaveBeenCalledWith(
      { path: 'players/player-1' },
      {
        'finesList/0': null,
        'finesList/fine-1': { ...unpaidFine, paid: true },
      }
    )
  })

  it('does not rewrite a fine that is already paid', async () => {
    firebase.get.mockResolvedValue(
      snapshot({ finesList: { 'fine-1': { ...unpaidFine, paid: true } } })
    )
    const player = new PlayerFinesC('player-1')

    await player.convertToPaid('fine-1')

    expect(firebase.set).not.toHaveBeenCalled()
    expect(firebase.update).not.toHaveBeenCalled()
  })

  it('treats deletion of a missing fine as a no-op', async () => {
    firebase.get.mockResolvedValue(snapshot({ finesList: {} }))
    const player = new PlayerFinesC('player-1')

    await expect(player.deleteFine('missing')).resolves.toBe(false)
    expect(firebase.remove).not.toHaveBeenCalled()
  })

  it('deletes only the requested fine node', async () => {
    firebase.get.mockResolvedValue(
      snapshot({ finesList: { 'fine-1': unpaidFine } })
    )
    const player = new PlayerFinesC('player-1')

    await expect(player.deleteFine('fine-1')).resolves.toBe(true)
    expect(firebase.remove).toHaveBeenCalledWith({
      path: 'players/player-1/finesList/fine-1',
    })
  })
})
