import { createLocalStorage, persist } from '$lib'

export const global = persist(createLocalStorage('global', 0), {
    root: true,
    syncTabs: true,
})
