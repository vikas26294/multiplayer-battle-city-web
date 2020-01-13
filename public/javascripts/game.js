var socket = null
var playerName = ""
var canvas = document.getElementById("game_canvas")
var ctx = canvas.getContext("2d")
var room = getUrlParameter("game")
var previousGameState = null
var currentGameState = null
var timeoutTime = 1000 / 5 //number of frames
var timeoutObject = null

// sprite
var img = new Image()
img.src = gameConfig.sprite.src

// dom ready
document.addEventListener("DOMContentLoaded", function() {
  var init = () => {
    // init materialize form fields
    window.M.updateTextFields()

    // init socket and listen for events
    socketListener()

    // click events
    clickEvents()
  }

  init()
})

// socket listerner
var socketListener = () => {
  socket = io()

  // join games room
  socket.emit(socketConfig.event.joinSpecificGameRoom, {
    room,
    player: getPlayerName(),
  })

  // socket connection failed
  socket.on(socketConfig.event.connectFailed, function() {
    window.M.toast({
      html: "Sorry, there seems to be an issue with the connection!",
    })
    clearTimeout(timeoutObject)
  })

  // cannot join game room
  socket.on(socketConfig.event.cannotJoinSpecificGameRoom, function(data) {
    clearTimeout(timeoutObject)
    window.M.toast({ html: data.message })
  })

  // game data
  socket.on(socketConfig.event.gameData, function(data) {
    console.log("game data", data)
    previousGameState = currentGameState
    currentGameState = data
    drawGame({ game: data })
  })

  // fetch game state every few milliseconds
  setTimeout(() => getUpdatedGameState(), timeoutTime)
}

// click events
var clickEvents = () => {
  // stop forms from submitting
  $("form").submit(function(e) {
    e.preventDefault()
  })

  // new player name submit button
  $("#new_player_name_button").on("click", function() {
    playerName = $("#new_player_name").val()
  })

  // start new game
  $(".new-game-card .join-button").on("click", function() {
    socket.emit(socketConfig.event.newJoinableGame, {
      room: $("#new_room_name").val(),
      player: playerName,
    })
  })

  // events
  document.addEventListener("keydown", onKeyDown, false)
  document.addEventListener("keyup", onKeyUp, false)
}

// draw game
var drawGame = ({ game }) => {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // am I P1?
  var isP1 = game.p1Socket === socket.id ? true : false

  // draw stage
  game.stage.split("").map((item, i) => {
    switch (item) {
      case ".":
      case "#":
      case "@":
      case "%":
      case "~":
      case "-":
        ctx.drawImage(
          img,
          gameConfig.assets[item].x,
          gameConfig.assets[item].y,
          spriteBlockSize,
          spriteBlockSize,
          row(i, game.lineBreak) * gameConfig.ssp,
          col(i, game.lineBreak) * gameConfig.ssp,
          gameConfig.ssp,
          gameConfig.ssp
        )
        break
    }
  })

  // draw home base
  ctx.drawImage(
    img,
    gameConfig.assets[game.isGameOver ? "homeBaseOver" : "homeBase"].x,
    gameConfig.assets[game.isGameOver ? "homeBaseOver" : "homeBase"].y,
    spriteBlockSize * 2,
    spriteBlockSize * 2,
    gameConfig.default.homeBase.x * gameConfig.ssp,
    gameConfig.default.homeBase.y * gameConfig.ssp,
    gameConfig.ssp * 2,
    gameConfig.ssp * 2
  )

  // draw players
  ;[1, 2].map(pNo => {
    if (game[`p${pNo}Socket`] && game[`p${pNo}Socket`].trim().length > 0) {
      console.log(gameConfig.assets[`p${pNo}`])
      ctx.drawImage(
        img,
        gameConfig.assets[`p${pNo}`][game[`p${pNo}Angle`]][1][1].x,
        gameConfig.assets[`p${pNo}`][game[`p${pNo}Angle`]][1][1].y,
        spriteBlockSize * 2,
        spriteBlockSize * 2,
        game[`p${pNo}PosX`] * gameConfig.ssp,
        game[`p${pNo}PosY`] * gameConfig.ssp,
        gameConfig.ssp * 2,
        gameConfig.ssp * 2
      )
    }
  })
}

var row = (index, lineBreak) => {
  return index % lineBreak
}

var col = (index, lineBreak) => {
  return Math.floor(index / lineBreak)
}

var onKeyDown = e => {
  var sendAction = true
  var direction = null
  var bulletShoot = false

  switch (e.keyCode) {
    case 37: // arrow left
    case 65: // a
      direction = gameConfig.default.directions.left
      break
    case 38: // arrow up
    case 87: // w
      direction = gameConfig.default.directions.up
      break
    case 39: // arrow right
    case 68: // d
      direction = gameConfig.default.directions.right
      break
    case 40: // arrow down
    case 83: // s
      direction = gameConfig.default.directions.down
      break
    case 91: // space
      bulletShoot = true
      break
    case 27: // escape
      clearTimeout(timeoutObject)
      break
    default:
      sendAction = false
      break
  }

  if (sendAction) {
    socket.emit(socketConfig.event.playerAction, {
      direction,
      bulletShoot,
    })
  }
}

var onKeyUp = e => {
  console.log("up", e)
}

var getUpdatedGameState = () => {
  console.log("getUpdatedGameState")
  socket.emit(socketConfig.event.getGameData)
  timeoutObject = setTimeout(() => getUpdatedGameState(), timeoutTime)
}
