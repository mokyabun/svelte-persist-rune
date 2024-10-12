import type { PersistStorage, PersistStorageEvent } from './storages'

export interface CustomRune<T> {
    value: T
}

export interface PersistRune<T> extends CustomRune<T> {
    cleanup: () => void
    reset: () => void
}

export function persist<T>(storage: PersistStorage<T>, root: boolean = false): PersistRune<T> {
    const { set, initialValue, defaultValue, event } = storage

    let state = $state<T>(initialValue)

    const syncWithStorage = () => {
        $effect(() => set(state))
    }
    const listenStorageEvent = (event?: PersistStorageEvent<T>) => {
        if (event) {
            return event((value) => {
                state = value
            })
        }
    }

    let cleanup = () => {}
    if (root) {
        cleanup = $effect.root(() => {
            syncWithStorage()
            return listenStorageEvent(event?.root)
        })
    } else {
        syncWithStorage()

        $effect(() => {
            return listenStorageEvent(event?.component)
        })
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
