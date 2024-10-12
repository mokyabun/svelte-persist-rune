import Cookies from 'js-cookie'
import { noop, type PersistStorage } from '$lib'

export function createCookieStorage<T>(
    key: string,
    initialValue: T,
    options?: Cookies.CookieAttributes,
): PersistStorage<T> {
    if (typeof document === 'undefined') {
        return noop<T>(initialValue)
    }

    const get = () => {
        const value = Cookies.get(key)

        return value ? JSON.parse(value) : initialValue
    }

    return {
        set: (value: T) => {
            Cookies.set(key, JSON.stringify(value), options)
        },
        initialValue: get(),
        rawInitialValue: initialValue,
    }
}
