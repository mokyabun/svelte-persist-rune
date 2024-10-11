export interface CustomRune<T> {
    value: T
}

export interface PersistRune<T> extends CustomRune<T> {
    cleanup: () => void
    reset: () => void
}

export interface PersistOptions<T> {
    storage: Storage
    serializer: (value: T) => string
    deserializer: (value: string) => T
    afterInit: (value: T) => T
    syncTabs: boolean
    root: boolean
}

const rootEventListeners = new Map<string, (value: string | null) => void>()
let isRootListenerAdded = false

function addRootEventListener(key: string, listener: (value: string | null) => void) {
    console.log(`adding root listener for ${key}`)

    rootEventListeners.set(key, listener)
}

function removeRootEventListener(key: string) {
    rootEventListeners.delete(key)
}

function onStorageChange(event: StorageEvent) {
    if (!event.key) return

    const listener = rootEventListeners.get(event.key)

    if (!listener) throw new Error(`No listener found for key ${event.key}`)

    listener(event.newValue)
}

function ensureRootListener() {
    if (!isRootListenerAdded && typeof window !== 'undefined') {
        window.addEventListener('storage', onStorageChange)
        isRootListenerAdded = true
    }
}

export function persist<T>(
    key: string,
    initialValue: T,
    options: Partial<PersistOptions<T>> = {},
): PersistRune<T> {
    const {
        storage = localStorage,
        serializer = JSON.stringify,
        deserializer = JSON.parse,
        afterInit = (value: T) => value,
        syncTabs = true,
        root = false,
    } = options

    const afterGet = (value: string | null) => {
        if (!value) return initialValue

        return deserializer(value)
    }

    const beforeSet = (value: T) => {
        return serializer(value)
    }

    let state = $state(afterInit(afterGet(storage.getItem(key))))

    const syncWithStorage = () => {
        $effect(() => {
            storage.setItem(key, beforeSet(state))
        })
    }

    let cleanup = () => {}
    if (root) {
        cleanup = $effect.root(() => {
            syncWithStorage()

            if (syncTabs) {
                addRootEventListener(key, (value) => {
                    state = afterGet(value)
                })

                ensureRootListener()

                return () => removeRootEventListener(key)
            }
        })
    } else {
        syncWithStorage()

        if (syncTabs) {
            const listener = (event: StorageEvent) => {
                if (event.key === key && event.newValue !== null) {
                    state = afterGet(event.newValue)
                }
            }

            $effect(() => {
                window.addEventListener('storage', listener)

                return () => window.removeEventListener('storage', listener)
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
            state = initialValue
        },
    }
}
