<script lang="ts">
    import { createLocalStorage, persist } from '$lib'

    const rune = persist(createLocalStorage('test', 0, { syncTabs: true }))
</script>

<p data-testid="value">{rune.value}</p>
<p data-testid="derived">{rune.value * 2}</p>
<button data-testid="increment" onclick={() => rune.value++}>Increment</button>
<button data-testid="decrement" onclick={() => rune.value--}>Decrement</button>
<button data-testid="reset" onclick={() => rune.reset()}>Reset</button>
