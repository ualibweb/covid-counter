<script>
  import BackEnd from './BackEnd/BackEnd.svelte'
  import TotalCount from './FrontEnd/TotalCount.svelte'

  export let
    // If we should show the backend
    backend = false,
    // Set the location
    location = undefined,
    // Credentials we can set for the backend
    credentials = false,
    // If we should log to console
    log = true,

    capacity

  $: location = location;

</script>


<svelte:options tag="covid-counter-app" immutable={false} accessors={true} />

{#if backend }
  <covid-counter-backend {location} {capacity} {credentials} {log} />
{:else}
  <covid-counter-total {log} />
{/if}
