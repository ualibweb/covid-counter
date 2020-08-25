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

Clone to your machine...

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

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.


## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
