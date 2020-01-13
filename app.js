const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")
const socketIo = require("socket.io")

const config = require("./config/")
const sockets = require("./services/sockets")
const indexRouter = require("./routes/index")
const roomsRouter = require("./routes/rooms")
const gameRouter = require("./routes/game")

const app = express()

// socket io
const io = socketIo()
app.io = io

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/rooms", roomsRouter)
app.use("/game", gameRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// sass
// app.use(
//   sass.middleware({
//     src: path.join(__dirname, 'public/sass'), //where the sass files are
//     dest: path.join(__dirname, 'public/stylesheets'), //where css should go
//     debug: true // obvious
//   })
// );

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

io.on("connection", function(socket) {
  // new client
  sockets.newClientJoined({ socket, io })

  // Whenever someone disconnects this piece of code executed
  socket.on(config.sockets.event.disconnect, () =>
    sockets.disconnect({ socket, io })
  )

  /* games room */
  // join games room
  socket.on(config.sockets.event.joinGamesRoom, () =>
    sockets.joinGamesRoom({ socket, io })
  )

  // new game is created by user
  socket.on(config.sockets.event.newJoinableGame, data =>
    sockets.newGameCreated({ socket, io, data })
  )

  /* games room */
  // join specific game room
  socket.on(config.sockets.event.joinSpecificGameRoom, data =>
    sockets.joinSpecificGameRoom({ socket, io, data })
  )

  // user input
  socket.on(config.sockets.event.playerAction, data =>
    sockets.actionByPlayer({ socket, io, data })
  )

  // get game data
  socket.on(config.sockets.event.getGameData, data =>
    sockets.sendGameState({ socket, io, data })
  )
})

module.exports = app
