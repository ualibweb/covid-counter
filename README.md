# UA Libraries Building Capacity Counter

To aid the libraries in social distancing measures due to the Covid-19 pandemic, WTD was asked to create a simple counter app. This app has three parts:

1. a WordPress plugin (not represented in this repo, see Jared's [covid counter plugin](https://github.com/ualibweb/covid-counter-plugin)) that creates a database and sets up and handles API endpoints
2. a "back-end" component with buttons that update a running count
3. a "front-end" component that lists the current counts/occupancy percentages for each location



## WordPress

Because there's a WordPress component to this, how you get your plugin up and running is up to you. However, I'll share what I did so you can have an idea of what to do!

### Plugin customization

This plugin is tailored specifically for the libraries at UA. The API endpoints for the counts are our individual library locations. You can change these to meet your needs! The `constants.php` file has an array of locations. Edit those to fit your situation.

We also added a custom user role, 'Covid Counter,' to lock down our counter pages to specific users. Admin users automatically have the Covid Counter permissions, but other users will need to have their role changed. If this doesn't fit your needs, feel free to remove it.

### Activating the plugin

1. clone [covid-counter-plugin](https://github.com/ualibweb/covid-counter-plugin) to your machine
1. add `covid-counter-plugin` directory to `/wp-content/plugins/` directory
2. activate plugin via WP dashboard
3. check your API endpoint! `http://yourwordpress.com/wp-json/covid-counter/counts` should return an empty array because you haven't logged any counts yet, but shouldn't return a 404. If you get `401 - unauthorized`, make sure you're logged in to WP and either an admin user or 'Covid Counter' custom role.
4. if you're logged in and an admin user, check your database for the table `wp_covid_counter_movements`. When testing this plugin, the table would occasionally not be added to the database, but we couldn't figure out why. You're on your own! :woman_shrugging:
5. If you want, you can test your endpoints using [Postman](https://www.postman.com/postman/). I did! See endpoint details in the next section.

### REST API endpoints

Because we have "front end" and "back end" components, we needed a variety of endpoints to meet our needs. 

#### GET /counts

This returns an array of objects with the current count for all locations, e.g.:

```json
[
  {
    "location": "bruno",
    "count": 10
  },
  {
    "location": "gorgas",
    "count": 48
  },
  {
    "location": "mclure",
    "count": 8
  },
  {
    "location": "rodgers",
    "count": 10
  }
]
```

#### GET /counts/[location]

This returns an object with the count for a specific location, e.g.:

```json
{
  "count": 48
}
```

#### POST /movements

This updates the count. It accepts a JSON object, e.g.

```json
{
    "location": "mclure",
    "type": "entry"
}
```

## Counter App

The front-end of this app is built in [svelte](https://svelte.dev/)! If you've ever used angular, react, or vue, svelte has a similar feel. Its big advantage is that it compiles down to vanilla JS, so there's no need to include a giant library when adding a component to your WP page. All you need is the bundled/minified JS file!

While this app is all technically front-end, I've broken it up into "front-end" and "back-end" components. Front and back in this case refers to wordpress or even users. The "front-end" component is on a public page for anyone to view the total count in each location, and the "back-end" component is on a private wordpress page where staff can click a button to update the count.

### Set up for development

Clone to your machine.. .

```bash
git clone https://github.com/ualibweb/covid-counter.git 
```

Install the dependencies...

```bash
cd covid-counter
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see the `/public/index.html` output, which showcases the two components and has some additional details. If you haven't changed the URLs in the API file, you should at least be seeing the counts from the libraries dev database. If you click the buttons, the count won't actually update because you're not logged in to our wordpress site! 

Edit a component file in `src`, save it, and reload the page to see your changes.

### Code that is unique to UA Libraries

All the API fetching is in `/src/api.js`. These are URLs specific to our plugin endpoints.

While the "back-end" component sets the capacity via props passed to it from the custom component HTML, the "front-end" component has an object in `/src/FrontEnd/TotalCount.svelte` called `locationCapacity` that lists those numbers.

The "front-end" component uses long polling to get the latest count from our API every 2 minutes. The "back-end" component has the ability to do so as well, but we turned it off for the sake of our server load. Both components have a prop/variable called `polling` that you can set to true/false, and another called `pollTime` where you can set the timing of the long poll.

Both components use conditional styling to update the color of the count based on current occupancy. Anything lower than 90% capacity will be green, and once it hits 90%, the number turns red. This logic is within the HTML portion of both `/src/FrontEnd/TotalCount.svelte` and `/src/BackEnd/BackEnd.svelte`.

### Build the production script

Once you're ready to add the script to your theme, it's time to run the build script. To create an optimised, vanilla JS version of the app:

```bash
npm run build
```

The resulting `/public/build/bundle.js` file created during this build process is what we include in our theme. You can add it wherever you enqueue your other scripts! Since it's vanilla JS, it doesn't require jQuery.

### Add the components to your WP page

This is the fun part! On the page where you want to add the component, create a Gutenberg HTML block, and insert the component element.

**FrontEnd component**

```html
<covid-counter-app></covid-counter-app>
```

**BackEnd component**

```html
<covid-counter-app backend="true" location="gorgas" capacity="200"></covid-counter-app>
```

You can also include these components in your WP theme, if you'd rather.
