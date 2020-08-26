<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte'

  import { getLocationRequest, postRequest } from '../api'
  import { count } from '../stores'
  import Incrementer from './Incrementer.svelte'
  import Decrementer from './Decrementer.svelte'


  // The Props
  export let
    // This is the prop that can be imported from the webcomponent
    location = undefined,
    // Credentials for the API
    credentials = false,
    // If we should log to console
    log = true,

    capacity

  // This will tell the page we are loading something
  let loading = true

  // We'll update this variable anytime there is an error
  let error = false

  // Set the pollTime to 120 seconds
  let pollTime = 120000

  // This will hold our poll timeout
  let polling = false

  // Log if allowed
  function logger(...val) {
    if (log) {
      console.log(...val)
    }
  }

  // This will update the store, so anything that needs this value can use it
  function updateCount(val = 0) {
    // Set the val of the count on the store
    count.set(val)
    // We'll return the val, because we should return something and it might be useful in the future.
    return val
  }

  // Post a value to the API
  async function post (val) {
    // Set loading to true
    loading = true

    // Clear out the previous errors
    error = false

    let response
    try {
      // Call the POST request here
      response = await postRequest(val, location, credentials)
    }
    catch (err) {
      logger('Error posting val', err)
      error = err
    }

    // Set the loading to finished
    loading = false

    // Return what we get back, just for safety
    return response
  }


  async function postIncrement (val) {
    let p = await post(val)
    logger('Posted Increment')
    let c = await getCount()
    return c
  }

  async function postDecrement (val) {
    let p = await post(val)
    logger('Posted Decrement')

    // Now get a fresh count
    let c = await getCount()
    return c
  }

  // Event handler from incrementer
  function incremented({ detail }) {
    logger(' I Am Incremented', detail)
    postIncrement(detail)
  }

  // Event handler from decrementer
  function decremented({ detail }) {
    logger('I Am Decremented', detail)
    postDecrement(detail)
  }


  async function getCount () {
    if (!location) return
    // Change the loading state to true
    loading = true

    // Clear the original error if any
    error = false

    // Change
    let res, count

    try {
      res = await getLocationRequest(location)
      count = await res.json()
    }
    catch (err) {
      logger('Error getting count', err)
      error = err
    }

    logger('Got count!', count)
    updateCount( count.count )

    // Change the loading state to false
    loading = false
  }

  // This function is what we call for long polling the api
  function longPoll () {
    logger('Long Poll Called', new Date(Date.now()))
    getCount()
  }

  // Starts polling the API
  function startLongPoll() {
    if (!polling) {
      logger('Starting Long Poll')
      polling = setInterval(function () {
        longPoll()
      }, pollTime)
    }
  }

  // Stops polling the API
  function toggleLongPoll () {
    if (polling) {
      logger('Will Stop Long Poll')
      stopLongPoll()
      polling = false
    }
    else {
      logger('Restarting Long Poll')
      startLongPoll()
    }
  }

  // Stops polling the API
  function stopLongPoll () {
    logger('Stopping Long Poll')
    clearInterval(polling)
    polling = false
  }



  // When the component leaves the page, it calls onDestroy
  onDestroy(async () => {
    return Promise.all([
      // Have it first get the current count from the API
      // stopLongPoll()
    ])
  })

  setTimeout(getCount, 1000);

</script>


<svelte:options tag="covid-counter-backend" immutable={false} accessors={true} />


<!-- Wait for the first API call -->
{#if loading}
  <h2>Loading...</h2>
{:else if error }
  <pre> { error } </pre>
{:else}
<!-- Show the result when not loading -->
<h2>The count is {$count}<span style="font-size:18px">/{capacity}</span></h2>
<h3>Occupancy: <span style="color:{($count / capacity) < .9 ? 'green' : 'red'}">{Math.round(($count / capacity) * 100)}%</span></h3>
{/if}

<Incrementer {loading} {error} on:increment={incremented} />
<Decrementer {loading} {error} on:decrement={decremented}/>
