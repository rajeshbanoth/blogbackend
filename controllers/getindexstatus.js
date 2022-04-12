var request = require("request");
var { google } = require("googleapis");


const jwtClient = new google.auth.JWT(
  process.env.CLIENT_EMAIL.replace(/\\n/g, '\n'),
  null,
  process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
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
  

  res.send(body)

    });
  });

}

