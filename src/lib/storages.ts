export interface PersistStorage<T> {
    set(value: T): void
    initialValue: T
    defaultValue: T
    event?: {
        root?: (listener: (value: T) => void) => () => void
        component?: (listener: (value: T) => void) => () => void
    }
}

export interface BrowserStorageOptions<T> {
    serialize: (value: T) => string
    deserialize: (value: string | null) => T
    initialize: (value: T) => T
}

export function noop<T>(defaultValue: T): PersistStorage<T> {
    return {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set: (value: any) => {},
        initialValue: defaultValue,
        defaultValue,
    }
}

function createStorage<T>(
    storage: 'localStorage' | 'sessionStorage',
    key: string,
    defaultValue: T,
    options: Partial<BrowserStorageOptions<T>> = {},
): PersistStorage<T> {
    if (typeof window === 'undefined') {
        return noop<T>(defaultValue)
    }

    const {
        serialize = JSON.stringify,
        deserialize = (value: string | null) => (value ? JSON.parse(value) : defaultValue),
        initialize = (value: any) => value,
    } = options

    const internalStorage = window[storage]

    const get = () => {
        const value = internalStorage.getItem(key)

        return deserialize(value)
    }

    return {
        set: (value: T) => internalStorage.setItem(key, serialize(value)),
        initialValue: initialize(get()),
        defaultValue: defaultValue,
        event: {
            root: (listener: (value: T) => void) => {
                ensureRootListener()

                const onStorageChange = (value: string | null) => {
                    listener(deserialize(value))
                }

                addRootStorageListener(key, onStorageChange)

                return () => removeRootStorageListener(key)
            },
            component: (listener: (value: T) => void) => {
                const onStorageChange = (event: StorageEvent) => {
                    if (event.key !== key) return

                    listener(deserialize(event.newValue))
                }

                window.addEventListener('storage', onStorageChange)

                return () => window.removeEventListener('storage', onStorageChange)
            },
        },
    }
}

export function createLocalStorage<T>(key: string, defaultValue: T): PersistStorage<T> {
    return createStorage('localStorage', key, defaultValue)
}

export function createSessionStorage<T>(key: string, defaultValue: T): PersistStorage<T> {
    return createStorage('sessionStorage', key, defaultValue)
}

export const rootStorageListeners = new Map<string, (value: string | null) => void>()
export let isRootListenerEnabled = false

export function onStorageChange(event: StorageEvent) {
    if (!event.key) return

    const listener = rootStorageListeners.get(event.key)

    if (!listener) return

    listener(event.newValue)
}

function ensureRootListener() {
    if (!isRootListenerEnabled && typeof window !== 'undefined') {
        window.addEventListener('storage', onStorageChange)
        isRootListenerEnabled = true
    }
}

function addRootStorageListener(key: string, listener: (value: string | null) => void) {
    rootStorageListeners.set(key, listener)
}

function removeRootStorageListener(key: string) {
    rootStorageListeners.delete(key)
}
