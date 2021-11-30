/**
 * Module dependencies.
 */
const OAuth2Strategy = require('passport-oauth2')
const InternalOAuthError = require('passport-oauth2').InternalOAuthError;

class Strategy extends OAuth2Strategy {

	/**
	 * `Strategy` constructor.
	 *
	 * The RingCentral authentication strategy authenticates requests by delegating to
	 * RingCentral using the OAuth 2.0 protocol.
	 *
	 * Applications must supply a `verify` callback which accepts an `accessToken`,
	 * `refreshToken` and service-specific `profile`, and then calls the `done`
	 * callback supplying a `user`, which should be set to `false` if the
	 * credentials are not valid.  If an exception occured, `err` should be set.
	 *
	 * Options:
	 *   - `clientID`      your RingCentral application's client id
	 *   - `clientSecret`  your RingCentral application's client secret
	 *   - `callbackURL`   URL to which RingCentral will redirect the user after granting authorization
	 *  <optional>
	 *   - passReqToCallback (default false) - directs passport to send the request object
	 *                                        to the verfication callback
	 *   - authorizationURL   url for the first part of the oauth grant
	 *   - tokenURL           url for the oauth token grant
	 *   - useSandbox         boolean to use the ringcentral sandbox api
	 *
	 * Examples:
	 *
	 *     passport.use(new RingCentralStrategy({
	 *         clientID: '123-456-789',
	 *         clientSecret: 'shhh-its-a-secret'
	 *         callbackURL: 'https://www.example.net/auth/ringcentral/callback'
	 *       },
	 *       function(accessToken, refreshToken, profile, done) {
	 *         User.findOrCreate(..., function (err, user) {
	 *           done(err, user);
	 *         });
	 *       }
	 *     ));
	 *
	 * @param {Object} options
	 * @param {Function} verify
	 * @api public
	 */
	constructor(options, verify) {
		options = options || {};
		options.authorizationURL = options.authorizationURL || 'https://platform.ringcentral.com/restapi/oauth/authorize';
		options.tokenURL = options.tokenURL || 'https://platform.ringcentral.com/restapi/oauth/token';

		//use the sandbox api
		if(options.useSandbox) {
			options.authorizationURL = 'https://platform.devtest.ringcentral.com/restapi/oauth/authorize';
			options.tokenURL = 'https://platform.devtest.ringcentral.com/restapi/oauth/token';
		}

		super(options, verify);

		//pass this for tests
		this.userAuthorizationURL = options.authorizationURL;
		this.accessTokenURL = options.tokenURL;

		this.name = 'ringcentral';
		this._passReqToCallback = options.passReqToCallback || false;

		// need to set this to true so that access_token is not appended to url
		this._oauth2.useAuthorizationHeaderforGET(true);

		//sign the request
		const secret = new Buffer.from(
			options.clientID + ':' + options.clientSecret
		).toString('base64');

		this._oauth2._customHeaders = {
			Authorization: `Basic ${secret}`
		}
	}

	/**
	 * Retrieve user profile from RingCentral.
	 *
	 * This function constructs a normalized profile, with the following properties:
	 *
	 *   - `provider`         always set to `ringcentral`
	 *   - `id`               the user's RingCentral ID
	 *   - `mainNumber`       the user's displayName name
	 *   - _json              json of the raw response (extra stuff)
	 *
	 * @param {String} accessToken
	 * @param {Function} done
	 * @api protected
	 */
	userProfile(accessToken, done) {
		// get user info
		this._oauth2.get('https://platform.devtest.ringcentral.com/restapi/v1.0/account/~', accessToken, function (err, body, res) {
			if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

			try {
				const json = JSON.parse(body);

				const profile = { provider: 'ringcentral' };
				profile.id = json.id;
				profile.mainNumber = json.mainNumber;

				profile._json = json;

				done(null, profile);
			} catch (e) {
				done(e);
			}
		});
	}
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
