var Promise = require("bluebird")

const config = require("../config/")
const redis = require("./redis")
const stage = require("./stage")
const gameLogic = require("./gameLogic")

let clients = 0

// new client joined
const newClientJoined = ({ socket, io }) => {
  clients++
  console.log("A user connected", "Total connected clients : ", clients)
}

// client disconnected
const disconnect = ({ socket, io }) => {
  clients--
  console.log("A user disconnected", "Total connected clients : ", clients)
  socket.leave(config.sockets.room.main)

  var room = null
  // disconnect from game room and update game state
  redis
    .getRoomByPlayer(socket.id)
    .then(roomInfo => {
      room = roomInfo
      if (!room) throw new Error("Was not part of a game room")

      return redis.getGameRoomInfo({ room })
    })
    .then(gameRoomData => {
      if (gameRoomData.p1Socket === socket.id) {
        // reset p1 data
        return redis.updateGameRoom({ room, data: { p1Socket: "" } })
      } else {
        // reset p2 data
        return redis.updateGameRoom({ room, data: { p2Socket: "" } })
      }
    })
}

/* Games room */
// join games room
const joinGamesRoom = ({ socket, io }) => {
  // join main room
  socket.join(config.sockets.room.main)

  // current games
  var rooms = []
  redis
    .getRooms()
    .then(roomsData => {
      rooms = roomsData
      return Promise.map(rooms, room => {
        return redis.getGameRoomInfo({ room })
      })
    })
    .then(gamesData => {
      var games = []
      gamesData.forEach((game, i) => {
        if (game && rooms[i]) {
          game.room = rooms[i]
          games.push(game)
        }
      })
      // send existing games
      socket.emit(config.sockets.event.joinableGames, { games })
    })
    .catch(err => {
      console.log("error", err)
    })
}

// when a new game is created
const newGameCreated = ({ socket, io, data }) => {
  const level = config.default.level

  // is room name available
  redis
    .isRoomNameAvailable({ room: data.room })
    .then(available => {
      if (!available) throw new Error("Room not available")

      // create new room
      return redis.createNewRoom({ room: data.room })
    })
    .then(() => {
      return stage.loadStage(level)
    })
    .then(stageData => {
      // create new room game
      return redis.createNewRoomGame({
        room: data.room,
        creator: data.player,
        level,
        stage: stageData,
        isGameOver: 0,
      })
    })
    .then(() => {
      // send to sender
      socket.emit(config.sockets.event.gameCreatedSuccessfully, {
        room: data.room,
      })
    })
    .then(() => {
      // send new game to all clients including sender
      io.in(config.sockets.room.main).emit(
        config.sockets.event.newJoinableGame,
        {
          game: {
            room: data.room,
            level: config.default.level,
          },
        }
      )
    })
}

/* Game room */
// join game room
const joinSpecificGameRoom = ({ socket, io, data }) => {
  var room = data.room
  var playerName = data.player

  // number of members in room
  var roomMembers = io.sockets.adapter.rooms[room]
    ? io.sockets.adapter.rooms[room].length
    : 0
  var memberNumber = roomMembers + 1

  if (memberNumber > 2) {
    // game room is full
    socket.emit(config.sockets.event.cannotJoinSpecificGameRoom, {
      message: "Game room is full",
    })
  } else {
    // join specific game room
    socket.join(room)

    // current games
    return redis
      .getGameRoomInfo({ room })
      .then(gameRoomInfo => {
        var member = 2

        // is p1 socket unoccupied
        if (!gameRoomInfo.p1Socket || gameRoomInfo.p1Socket.trim().length < 1) {
          member = 1
        }

        // info to update
        var gameRoomUpdateInfo = {}
        gameRoomUpdateInfo[`p${member}`] = playerName
        gameRoomUpdateInfo[`p${member}Socket`] = socket.id

        // set player initial position
        gameRoomUpdateInfo[`p${member}PosX`] =
          config.default[`p${member}`].initialPos.x
        gameRoomUpdateInfo[`p${member}PosY`] =
          config.default[`p${member}`].initialPos.y
        gameRoomUpdateInfo[`p${member}Angle`] = config.default.angle

        return redis.updateGameRoom({ room, data: gameRoomUpdateInfo })
      })
      .then(() => redis.mapPlayerWithGameRoom({ room, player: socket.id }))
      .catch(err => {
        console.log("error", err)
      })
  }
}

// action by player
const actionByPlayer = ({ socket, io, data }) => {
  const room = _getRoomFromSocket(socket)
  const { direction, bulletShoot } = data

  return redis
    .getGameRoomInfo({ room })
    .then(gameRoomInfo => {
      // member number
      const member = gameRoomInfo.p1Socket == socket.id ? 1 : 2

      // updated info
      const { x, y, newAngle } = gameLogic.movePlayer({
        gameRoomInfo,
        member,
        direction,
      })

      // info to update
      let gameRoomUpdateInfo = {}
      gameRoomUpdateInfo[`p${member}PosX`] = x
      gameRoomUpdateInfo[`p${member}PosY`] = y
      gameRoomUpdateInfo[`p${member}Angle`] = newAngle

      return redis.updateGameRoom({ room, data: gameRoomUpdateInfo })
    })
    .catch(err => console.log("error", err))
}

// get rook from socket
const _getRoomFromSocket = socket => {
  return Object.keys(socket.rooms).filter(item => item != socket.id)[0]
}

// update players about new game state
const sendGameState = ({ socket, io }) => {
  const room = _getRoomFromSocket(socket)

  return redis.getGameRoomInfo({ room }).then(gameRoomInfo => {
    // send existing games
    io.in(room).emit(config.sockets.event.gameData, {
      isGameOver: parseInt(gameRoomInfo.isGameOver),
      ...gameRoomInfo,
    })
  })
}

module.exports = {
  newClientJoined,
  disconnect,
  joinGamesRoom,
  newGameCreated,
  joinSpecificGameRoom,
  actionByPlayer,
  sendGameState,
}
