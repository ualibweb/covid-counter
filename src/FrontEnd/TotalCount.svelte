<script>

  import { getRequest } from '../api'
  import { libraryCounts } from '../stores'
  
  import _ from 'lodash'

  // The Props
  export let
    // If we should log to console
    log = true

  // Set the pollTime to 30 seconds
  let pollTime = 120000

  // This will hold our poll timeout
  let polling = false


  let error = false

  let totalCount;

  const locationCapacity = {
    bruno: 264,
    gorgas: 500,
    hoole: 5,
    mclure: 79,
    rodgers: 132
  }

  // LOGIC
  //
  function logger(...val) {
    if (log) {
      console.log(...val)
    }
  }


  function updateLibrary(arr) {
		libraryCounts.set(arr)
    return arr
	}


  async function getTotalCount () {

    error = false
    
    let res, totalCount
    res = await getRequest();
    totalCount = await res.json();

    totalCount = _.orderBy(totalCount, ['location'], ['asc'])
  
    updateLibrary(totalCount);

    return totalCount
  }

  // This function is what we call for long polling the api
  function longPoll () {
    logger('Long Poll Called', new Date(Date.now()))
    getTotalCount()
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

  setTimeout(getTotalCount, 1000);
  setTimeout(startLongPoll, 1100);

  let low = .90;

</script>

<style>
  .low {
    color: green;
  }
  .high {
    color:red;
  }
  .count-container {
    font-size:24px;
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    align-items: center;
    padding-bottom:15px;
    padding-left:20px;
  }
  .count-nested {
    display: grid;
    grid-template-columns: 120px 90px 115px;
  
  }
  .count-header {
    font-weight:700;
    padding-bottom: 15px;
  }
  .count-list-count, .count-list-capacity {
    padding-left:15px;
  }
</style>

<svelte:options tag="covid-counter-total" immutable={false} accessors={true} />
<div class="count-container">
  <div class="count-nested count-header">
    <span>Location</span>
    <span>Count</span>
    <span>Occupancy</span>
  </div>
    {#each $libraryCounts as {location, count}, i}
      <div class="count-nested">
       {#if location == 'mclure'}
         <span class="count-list-location">McLure</span>
       {:else}
         <span class="count-list-location">{_.startCase(location)}</span>
         {/if}
     <span class="count-list-count">{count}</span>
   {#if locationCapacity.hasOwnProperty(location)}
     <span class="{(count / locationCapacity[location]) > low ? 'high' : 'low'} count-list-capacity">{Math.round((count / locationCapacity[location]) * 100)}%</span>
     {/if}
      </div>
    {/each}
  </div>
