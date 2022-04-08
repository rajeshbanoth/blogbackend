var request = require("request");
var { google } = require("googleapis");
var key = require("./service_account.json");

const jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ["https://www.googleapis.com/auth/indexing"],
  null
);

exports.getstatus=(url,res)=>{

  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    }
    let options = {
      url: `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${url}`,
      method: "GET",
      // Your options, which must include the Content-Type and auth headers
      headers: {
        "Content-Type": "application/json"
      },
      auth: { "bearer": tokens.access_token },
  
    };
    request(options, function (error, response, body) {
      // Handle the response
      console.log(body);

    //res.send(body)

    });
  });

}

