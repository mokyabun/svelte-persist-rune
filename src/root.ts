import { createLocalStorage, persist } from '$lib'

export const rootRune = persist(createLocalStorage('root-test', 0, { syncTabs: true }), true)
