// Includes any required modules
const pug = require("pug");
const path = require("path");
const request = require("request");

// Sets the API's address
let api = "https://fqiawae364.execute-api.eu-west-1.amazonaws.com/prod/\
ses-dashboard";

// Compiles error.pug and index.pug
var error_page = pug.compileFile(path.join("views", "error.pug"));
var index_page = pug.compileFile(path.join("views", "index.pug"));

// Creates the lambda handler function
exports.handler = (event, context, callback) => {

  // Retrieve API data
  request(api, (error, response, body) => {

    // If the API cannot be contacted
    if (error)
      return callback(null, error_page({
        error: "Error contacting API",
        description: "This could be because the server's address moved, or \
because of networking/firewalling faults."
      }));

    // If the API's response cannot be parsed
    let body_json;
    if (!(body_json = JSON.parse(body)))
      return callback(null, error_page({
        error: "Error parsing API response",
        description: "This is probably the programmer's fault (sorry)."
      }));

    // If the API returns an authentication error
    if (body_json.message == "Missing Authentication Token")
      return callback(null, error_page({
        error: "Error authenticating with the API",
        description: "This is probably the programmer's fault (sorry)."
      }));

    // Parse the SES API data and serve it to the user
    return callback(null, index_page({
      enabled: body_json.body.ses_sending_enabled,
      bounce_rate: body_json.body.stats.bounce_rate,
      complaint_rate: body_json.body.stats.complaint_rate,
      total_send_attempts: body_json.body.stats.total_send_attempts,
      total_send_quota: body_json.body.stats.total_send_quota
    }));

  });

};
