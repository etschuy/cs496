var client_id = encodeURIComponent("476074288057-p310k2e371kt9a99thtf08kbk272ogh7.apps.googleusercontent.com");
var redirect_uri = encodeURIComponent(window.location.href + "/oauthcallback.html");
var response_type = "token";
var scope = "email";
var state = Math.random().toString(36).substring(7);

var oauth_url = "https://accounts.google.com/o/oauth2/v2/auth?";
oauth_url += "scope=" + scope + "&redirect_uri=" + redirect_uri + "&response_type=" + response_type + "&client_id=" + client_id + "&state=" + state;

console.log(oauth_url);

// don't feel like pulling in jQuery for one GET request :)
function get(url, cb) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200)
          cb(req.responseText);
  }
  req.open("GET", url);
  req.send(null);
}

function trigger_login() {
  window.location.href = oauth_url;
}

if (window.location.hash !== "") {
  // http://localhost:8000/oauthcallback.html
  // #access_token=abcxyz123
  // &token_type=Bearer&expires_in=3600

  // separates a hash parameter string to its parts (from the Google documentation)
  var params = {};
  var regex = /([^&=]+)=([^&]*)/g, m;
  while (m = regex.exec(location.hash.substring(1))) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }

  var verification_url = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=";
  get(verification_url + params['access_token'], function(body) {
    var token = JSON.parse(body);
    if (token.error) {
      alert("something went wrong, your token is invalid!");
      return;
    }

    var a = document.getElementById("plus");
    a.href = "https://plus.google.com/" + token.sub;
    a.innerHTML = "click!";

    var st = document.getElementById('state');
    st.innerHTML = params['state'];

    var user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=";
    get(user_info_url + params['access_token'], function(body) {
      var info = JSON.parse(body);
      if (info.error) {
        alert("something went wrong, couldn't load profile information!");
        return;
      }

      var nm = document.getElementById('name');
      nm.innerHTML = info.name;
    });
  });
}
