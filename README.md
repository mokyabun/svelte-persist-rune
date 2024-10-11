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

    const testRune = persist('test', 0)
</script>

<p>{testRune.value}</p>
```

Global state

```typescript
// use $effect.root
export const theme = persist<'light' | 'dark'>('theme', 'dark', { root: true })
```

## License

MIT
