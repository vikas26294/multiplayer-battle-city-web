var Promise = require("bluebird")
var redis = require("redis")

Promise.promisifyAll(redis)
var client = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
})

// constants
var rooms = "rooms"

// on error
client.on("error", function(err) {
  console.log("Redis client error " + err)
})

// get rooms
var getRooms = () => {
  return client.smembersAsync(rooms).then(res => res)
}

// is room name available
var isRoomNameAvailable = ({ room }) => {
  return client.sismemberAsync(rooms, room).then(res => res === 0)
}

// create new room
var createNewRoom = ({ room }) => {
  return client.saddAsync(rooms, room).then(res => res === 0)
}

// get game room info
var getGameRoomInfo = ({ room, fields = null }) => {
  var cmd =
    fields !== null
      ? client.hmgetAsync(room, ...fields)
      : client.hgetallAsync(room)

  return cmd.then(res => res)
}

// create new room game
var createNewRoomGame = ({ room, stage, ...params }) => {
  return client
    .hmsetAsync(room, {
      ...stage,
      ...params,
    })
    .then(res => res === 0)
}

// update specific game room
var updateGameRoom = ({ room, data }) => {
  return client.hmsetAsync(room, data).then(res => res === 0)
}

// map player with game room
var mapPlayerWithGameRoom = ({ room, player }) => {
  return client.setAsync(player, room).then(res => res === 0)
}

// get room with mapped player
var getRoomByPlayer = player => {
  return client.getAsync(player).then(res => res)
}

module.exports = {
  getRooms,

  isRoomNameAvailable,
  createNewRoom,
  createNewRoomGame,
  updateGameRoom,
  getGameRoomInfo,

  mapPlayerWithGameRoom,
  getRoomByPlayer,
}
