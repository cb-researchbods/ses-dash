// Imports and calls the handler function
const path = require("path");
const lambda_handler = require(path.join("..", "index"));

lambda_handler.handler(null, null, (error, result) => {

  // Throw an error if one is returned by the lambda function
  if (error)
    throw error;

  // Print the result of the lambda function
  console.log(result);

});
