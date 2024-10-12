import type { PersistStorage } from './storages'

export interface CustomRune<T> {
    value: T
}

export interface PersistRune<T> extends CustomRune<T> {
    cleanup: () => void
    reset: () => void
}

export interface PersistOptions {
    syncTabs?: boolean
    root?: boolean
}

export function persist<T>(
    storage: PersistStorage<T>,
    options: PersistOptions = {},
): PersistRune<T> {
    const { syncTabs = false, root = false } = options
    const { set, initialValue, defaultValue, event } = storage

    let state = $state<T>(initialValue)

    const syncWithStorage = () => {
        $effect(() => set(state))
    }
    const listenStorage = (value: T) => (state = value)

    let cleanup = () => {}
    if (root) {
        cleanup = $effect.root(() => {
            syncWithStorage()

            if (syncTabs) {
                return event?.root ? event.root(listenStorage) : () => {}
            }
        })
    } else {
        syncWithStorage()

        if (syncTabs) {
            $effect(() => {
                return event?.component ? event.component(listenStorage) : () => {}
            })
        }
    }

    return {
        get value() {
            return state
        },
        set value(value: T) {
            state = value
        },
        cleanup,
        reset: () => {
            state = defaultValue
        },
    }
}
