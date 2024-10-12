<script lang="ts">
    import type { PersistRune } from '$lib'

    let { rootRune }: { rootRune: PersistRune<number> } = $props()
</script>

<p data-testid="root-value">{rootRune.value}</p>
<p data-testid="root-derived">{rootRune.value * 2}</p>
<button data-testid="root-increment" onclick={() => rootRune.value++}>Increment</button>
<button data-testid="root-decrement" onclick={() => rootRune.value--}>Decrement</button>
<button data-testid="root-reset" onclick={() => rootRune.reset()}>Reset</button>
