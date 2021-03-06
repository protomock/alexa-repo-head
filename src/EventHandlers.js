var requestHandlers = require('./RequestHandlers')
var fetcher = require('./InformationFetcher')

module.exports = {
  onSessionStarted: function (sessionStartedRequest, session) {
    console.log('onSessionStarted requestId: ' + sessionStartedRequest.requestId +
            ', sessionId: ' + session.sessionId)
  },
  onIntent: function (intentRequest, session, response) {
    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name
    var intentHandler = this.intentHandlers[intentName]
    if (intentHandler) {
      console.log('dispatch intent = ' + intentName)
      intentHandler.call(this, intent, session, response)
    } else {
      throw new Error('Unsupported intent = ' + intentName)
    }
  },
  onLaunch: function (launchRequest, session, response) {
    console.log('onLaunch requestId: ' + launchRequest.requestId + ', sessionId: ' + session.sessionId)
    requestHandlers.handleWelcomeRequest(session, response)
  },
  onSessionEnded: function (sessionEndedRequest, session) {
    console.log('onSessionEnded requestId: ' + sessionEndedRequest.requestId +
            ', sessionId: ' + session.sessionId)
  },
  onInvocation: function (session, response, success) {
    if (session.user.accessToken) {
      fetcher.getUserInformation(session, response, success)
    } else {
      requestHandlers.handleUnLinkedWelcomeRequest(response)
    }
  }
}
