var socket = null

// dom ready
document.addEventListener("DOMContentLoaded", function() {
  var init = () => {
    // modal init
    $(".modal").modal()
    $("#player_name_modal").modal({ dismissible: false })
    $("#player_name_modal").modal("open")

    // focus player name field
    $("#new_player_name").focus()
    $("#new_player_name").val(getPlayerName())

    // random string for new room name
    $("#new_room_name").val(generateRandomString(10))

    // init materialize form fields
    window.M.updateTextFields()

    // init socket and listen for events
    socketListener()

    // click events
    clickEvents()
  }

  init()
})

// add new existing game
var addNewExistingGame = game => {
  // already exists
  if ($(`#${game.room}`).length > 0) return false

  // update template data
  var template = $(existing_game_template)[0]
  template.setAttribute("data-id", game.room)
  template.querySelector(".room").innerHTML = `Room: ${game.room}`
  template.querySelector(".level").innerHTML = `Level: ${game.level}`
  template.querySelector(".player").innerHTML = `Player: ${game.p1 || game.p2}`

  // add to html
  $("#room_container").append(template)
}

// socket listerner
var socketListener = () => {
  socket = io()

  // join games room
  socket.emit(socketConfig.event.joinGamesRoom)

  // socket connection failed
  socket.on(socketConfig.event.connectFailed, function() {
    window.M.toast({
      html: "Sorry, there seems to be an issue with the connection!",
    })
  })

  // all joinable games
  socket.on(socketConfig.event.joinableGames, function(data) {
    data.games.some(game => addNewExistingGame(game))
  })

  // new joinable game is created
  socket.on(socketConfig.event.newJoinableGame, function(data) {
    addNewExistingGame(data.game)
  })

  // game created successfully
  socket.on(socketConfig.event.gameCreatedSuccessfully, function(data) {
    window.location.href = getGamePageUrl(data.room)
  })
}

// click events
var clickEvents = () => {
  // stop forms from submitting
  $("form").submit(function(e) {
    e.preventDefault()
  })

  // new player name submit button
  $("#new_player_name_button").on("click", function() {
    setPlayerName($("#new_player_name").val())
  })

  // join existing game
  $(document).on("click", ".existing-game-card .join-button", function() {
    window.location.href = getGamePageUrl(
      $(this)
        .parents(".existing-game-card")[0]
        .getAttribute("data-id")
    )
  })

  // start new game
  $(".new-game-card .join-button").on("click", function() {
    socket.emit(socketConfig.event.newJoinableGame, {
      room: $("#new_room_name").val(),
      player: getPlayerName(),
    })
  })
}
