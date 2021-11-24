![CI](https://github.com/docket-hq/passport-ringcentral/workflows/CI/badge.svg?branch=main)

# Passport - RingCentral

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [RingCentral](https://www.ringcentral.com/) using the OAuth 2.0 API.

This module lets you authenticate using RingCentral in your Node.js applications.
By plugging into Passport, RingCentral authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-ringcentral

## Usage

#### Configure Strategy

The RingCentral authentication strategy authenticates users using a RingCentral
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new RingCentralStrategy({
        clientID: RINGCENTRAL_CLIENT_ID,
        clientSecret: RINGCENTRAL_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/ringcentral/callback",
        passReqToCallback: true
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ ringCentral: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'ringcentral'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/ringcentral',
      passport.authenticate('ringcentral'));

    app.get('/auth/ringcentral/callback',
      passport.authenticate('ringcentral', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

**Optional Parameters:**
- **passReqToCallback** (default: false) - directs passport to send the request object to the verfication callback
- **authorizationURL**  (default: 'https://platform.ringcentral.com/restapi/oauth/authorize') - url for the first part of the oauth flow
- **tokenURL**          (default: 'https://platform.ringcentral.com/restapi/oauth/token') - url for the oauth token grant

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
