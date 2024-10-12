# svelte-persist-rune

A custom rune in Svelte 5 that syncs with browser storage. Based on [svelte-persisted-store](https://github.com/joshnuss/svelte-persisted-store)

```bash
npm i svelte-persist-rune
```

```bash
pnpm add svelte-persist-rune
```

```bash
yarn add svelte-persist-rune
```

## Example

In component

```html
<script>
    import { persist } from 'svelte-persist-rune'

    const rune = persist(createLocalStorage('test', 0))
</script>

<p>{rune.value}</p>
```

Global state

```typescript
// use $effect.root
const rune = persist(createLocalStorage('test', 0), true)
```

With sync tabs

```html
<script>
    import { persist } from 'svelte-persist-rune'

    const rune = persist(createLocalStorage('test', 0, { syncTabs: true }))
</script>

<p>{rune.value}</p>
```

## Custom storage

#### This is just examples and they are not tested!!

Cookie storage

```typescript
import Cookies from 'js-cookie'
import { noop, type PersistStorage } from 'svelte-persist-rune'

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
        defaultValue: initialValue,
    }
}
```

idb-keyval storage

```typescript
// idb-storage.ts
import { get as idbGet, set as idbSet } from 'idb-keyval'
import { noop, type PersistStorage } from 'svelte-persist-rune'

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

// +page.ts
import { createIdbStorage } from './idb-storage'

export async function load() {
    return await createIdbStorage('key', 10)
}
```

## License

MIT
