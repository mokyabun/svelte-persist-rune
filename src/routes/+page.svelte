<script lang="ts">
    import { persist } from '$lib'
    import { global } from './global'

    const testRune = persist('testRune', {
        int: 0,
        string: 'test',
        boolean: true,
    })
</script>

<h1>test-rune</h1>
<p>{testRune.value.int}</p>
<p>{testRune.value.int * 2}</p>

<button onclick={() => (testRune.value.int += 1)}>Increment</button>
<button onclick={() => (testRune.value.int -= 1)}>Decrement</button>

<h1>global-rune</h1>
<p>{global.value}</p>

<button onclick={() => global.value++}>Increment global</button>
<button onclick={() => global.value--}>Decrement global</button>
