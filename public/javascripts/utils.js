// generate random string
function generateRandomString(len) {
  var text = ""
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

// get url param
function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  var results = regex.exec(location.search)
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "))
}

// store prefix
var _storePrefix = "bc_"

// get data from store
function getStoreItem(key) {
  return localStorage.getItem(_storePrefix + key)
}

// get data in store
function setStoreItem(key, value) {
  return localStorage.setItem(_storePrefix + key, value)
}

// set player name
var setPlayerName = value => setStoreItem("playerName", value)

// get player name
var getPlayerName = () => {
  var plName = getStoreItem("playerName")
  return plName ? plName : "Player"
}

// get game page url
var getGamePageUrl = room => {
  return (window.location.href =
    window.location.protocol +
    "//" +
    window.location.host +
    `/game?game=${room}`)
}
