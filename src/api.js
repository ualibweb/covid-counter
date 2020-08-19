/**
 * Make a Post Request to UA covid counter
 * @param val
 * @param credentials
 * @param location
 * @return {Promise<Response>}
 */

let dev = "https://wwwdev2.lib.ua.edu";

export const postRequest = function (val, location, credentials) {
  const body = { ...val, location };
  console.log(body);

  // TODO, use the location in the body and credentials in the header
  // TODO, change to UA
  return fetch(`https://wwwdev2.lib.ua.edu/wp-json/covid-counter/movements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `JWT ${credentials}`
    },
    body: JSON.stringify({ ...val, location }),
  });
};

/**
 * Make a Get request to UA covid counter
 * @param location
 * @return {Promise<Response>}
 */
export const getLocationRequest = function (location) {
  // TODO, change to UA
  return fetch(
    `https://wwwdev2.lib.ua.edu/wp-json/covid-counter/counts/${location}`
  );
};

export const getRequest = function () {
  // TODO, change to UA
  return fetch(`https://wwwdev2.lib.ua.edu/wp-json/covid-counter/counts`);
};
