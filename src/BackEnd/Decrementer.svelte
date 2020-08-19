<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let loading = false, error = false

  function decrement() {
    dispatch('decrement', {
      "type": "exit"
    })
  }

</script>


<svelte:options tag="covid-counter-decrementer" immutable={false} accessors={true} />
<button style="padding:50px;font-size:20px;color:red" on:click={decrement} disabled="{loading || error}">
  Exit<br/>
  -
</button>
