# UA Libraries' Building Capacity Counter

To aid the libraries in social distancing measures due to the Covid-19 pandemic, WTD was asked to create a simple counter app. This app has three parts:

1. a WordPress plugin (not represented in this repo, see Jared's repo) that creates a database and sets up and handles API endpoints
2. a "back-end" app with buttons that update a running count
3. a "front-end" app that lists the current counts/occupancy percentages for each location

## Get started

Because there's a WordPress component to this, how you get your plugin up and running is up to you. However, I'll share what I did so you can have an idea of what to do!

### WordPress

#### Plugin customization

This plugin is tailored specifically for the libraries at UA. The API endpoints for the counts are our individual library locations. You can change these to meet your needs! The `constants.php` file has an array of locations. Edit those to fit your situation.

We also added a custom user role, 'Covid Counter,' to lock down our counter pages to specific users. Admin users automatically have the Covid Counter permissions, but other users will need to have their role changed. If this doesn't fit your needs, feel free to remove it.

#### Activating the plugin

1. add `covid-counter` plugin directory to `/wp-content/plugins/` directory
2. activate plugin via WP dashboard
3. check your API endpoint! `http://yourwordpress.com/wp-json/covid-counter/counts` should return an empty array because you haven't logged any counts yet, but shouldn't return a 404. If you get `401 - unauthorized`, make sure you're logged in to WP and either an admin user or 'Covid Counter' custom role.
4. if you're logged in and an admin user, check your database for the table `wp_covid_counter_movements`. When testing this plugin, the table would occasionally not be added to the database, but we couldn't figure out why. You're on your own! :woman_shrugging:
5. If you want, you can test your endpoints using Postman. I did! See endpoint details in the next section.

#### REST API endpoints

Because we have "front end" and "back end" apps, we needed a variety of endpoints to meet our needs. 

##### GET /counts

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

##### GET /counts/[location]

This returns an object with the count for a specific location, e.g.:

```json
{
  "count": 48
}
```

##### POST /movements

This updates the count. It accepts a JSON object, e.g.

```json
{
    "location": "mclure",
    "type": "entry"
}
```

### Counter App

The front-end of this app is built in [svelte](https://svelte.dev/)! If you've ever used angular, react, or vue, svelte has a similar feel. Its big advantage is that it compiles down to vanilla JS, so there's no need to include a giant library when adding a component to your WP page. All you need is the bundled/minified JS file!

While this app is all technically front-end, I've broken it up into "front-end" and "back-end" components. Front and back in this case refers to wordpress or even users. The "front-end" component is on a public page for anyone to view the total count in each location, and the "back-end" component is on a private wordpress page where staff can click a button to update the count.

#### Setting it up

Clone to your machine.. .

```bash
git clone 
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

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

## Build the production script

To create an optimised, vanilla JS version of the app:

```bash
npm run build
```

The resulting `bundle.js` file created during this build process is what we include in our theme.
