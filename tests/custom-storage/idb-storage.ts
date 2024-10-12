import { get as idbGet, set as idbSet } from 'idb-keyval'
import { noop, type PersistStorage } from '$lib'

export async function createIdbStorage<T>(
    key: string,
    initialValue: T,
): Promise<PersistStorage<T>> {
    if (typeof window === 'undefined') {
        return noop<T>(initialValue)
    }

    return {
        set: (value: T) => {
            idbSet(key, value)
        },
        initialValue: (await idbGet<T>(key)) ?? initialValue,
        defaultValue: initialValue,
    }
}
