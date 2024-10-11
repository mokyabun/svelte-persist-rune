import { persist } from '$lib'

export const global = persist('global', 0, { root: true })
