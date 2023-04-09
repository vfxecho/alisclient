//alert('loaded facebook.js');

  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      $('#login').fadeOut('fast')
      $('#logout').fadeIn('slow')
      $('#statusfb').html('You have successfully logged in.')
      //$('#shop').fadeIn('slow')

      // Logged into your app and Facebook.
      testAPI();
	  getJWT(response.authResponse.userID, response.authResponse.accessToken);
    } else if (response.status === 'not_authorized') {
      $('#login').fadeIn('slow')

      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      $('#login').fadeIn('slow')
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

	// Logout thingy
	function fbLogout() {
        FB.logout(function (response) {
            //Do what ever you want here when logged out like reloading the page
            window.location.reload();
        });
    }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1473737165974722',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      var name = response.name;
      name = name.substring(0, name.lastIndexOf(" "));
      $('#socialpanel h4').html(name);
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }

	// Get our JWT from the API
	function getJWT(userid, accesstoken) {
		jwt = null; // flush out our jwt.
		var url = '/api/auth/facebook';
		var method = 'POST';
		var data = {
		    userID: userid,
		    accessToken: accesstoken,
		};
		var success = function(response){
		    jwt = response.token;
		    console.log('login successful, got jwt token: ' + jwt);
			if(jwt == null) {
				$("#testconnect").append("Something went wrong with facebook auth, could not get token!<br>");
				$("#testconnect").append("Open the chrome console (F12) and send the logs to nosx!<br>");
			}else{
				$("#testconnect").append("try dropping this in your alis.io console to play on Instant2:<br>");
				$("#testconnect").append("<textarea style=\"width: 1300px; height: 50px;\">connect(\"ws://game01.na.alis.io:4002/?token=" + jwt + "\");</textarea><br>");
				$("#testconnect").append("hint: F12 should bring up the developer console in chrome<br>");
				$("#jwt").val(jwt);
			}
		}
		var failure = function(error) {
		    console.log('login failed with error:');
		    var message = JSON.parse(error.responseText);
		    console.log(message);
			$("#testconnect").append("could not get token from web service, send logs to nosx! " + message);
		}
		// run the api call specified and wait for its response
		apicall(url, method, data, success, failure)
	}

    // dumb wrapper for api calls because im lazy and bad at javascript
    function apicall(url, method, data, goodcall, badcall) {
        // if we have a JWT set, send it with the request
        if(jwt != null) {
            url = url + '?token=' + jwt;
        }
        console.log('SENT:' + method + ' ' + url + ' DATA: ' + JSON.stringify(data) );
        // call the ajax and wait for it to complete
        var ajaxCall = $.ajax({
            url: url,
            method: method,
            data: data,
            success: function(data) {
                //pagelog(2,'RECV: ' + JSON.stringify(data));
                // this is some optional code to capture updated auth tokens as we make calls
                var responseHeaders = ajaxCall.getAllResponseHeaders();
                var regex = /authorization: Bearer ([a-zA-Z0-9_\-]*\.[a-zA-Z0-9_\-]*\.[a-zA-Z0-9_\-]*)/;
                if(responseHeaders.match(regex)) {
                    jwt = responseHeaders.match(regex)[1];
                    console.log('api auth token updated: ' + jwt);
                }else{
                    console.log('api auth token not updated after this call');
                }
                // invoke the success callback function
                goodcall(data);
            },
            error: function(error, errorThrown) {
                //pagelog(2,'ERROR: ' + JSON.stringify(error) + 'error: ' + JSON.stringify(errorThrown));
                // invoke the failure callback function
                badcall(error);
            }
        });
    }