<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let loading = false, error = false

  function increment() {
    dispatch('increment', {
      "type": "entry"
    })
  }

</script>
<svelte:options tag="covid-counter-incrementer" immutable={false} accessors={true} />
<button style="padding:50px;font-size:20px;color:green" on:click="{increment}" disabled="{loading || error}">
  Entry<br/>
  +
</button>
