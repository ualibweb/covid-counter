/**
 * Make a Post Request to UA covid counter
 * @param val
 * @param credentials
 * @param location
 * @return {Promise<Response>}
 */

export const postRequest = function (val, location, credentials) {
  const body = { ...val, location };
  console.log(body);

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
  return fetch(
    `https://wwwdev2.lib.ua.edu/wp-json/covid-counter/counts/${location}`
  );
};

export const getRequest = function () {
  return fetch(`https://wwwdev2.lib.ua.edu/wp-json/covid-counter/counts`);
};
