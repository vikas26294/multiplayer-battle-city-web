module.exports = {
  assets: {
    blockers: ["#", "@", "~", "-", "X"],
    all: [".", "#", "@", "%", "~", "-", "X"],
  },
  default: {
    level: 1,
    p1: {
      initialPos: {
        x: 8,
        y: 24,
      },
    },
    p2: {
      initialPos: {
        x: 16,
        y: 24,
      },
    },
    directions: {
      up: "u",
      down: "d",
      left: "l",
      right: "r",
    },
    angle: 0,
  },
  sockets: {
    room: {
      main: "main",
    },
    event: {
      joinGamesRoom: "join-games-room",
      joinableGames: "joinable-games",
      newJoinableGame: "new-joinable-game",
      connectFailed: "connect_failed",
      disconnect: "disconnect",
      gameCreatedSuccessfully: "game-created-successfully",
      joinSpecificGameRoom: "join-specific-game-room",
      cannotJoinSpecificGameRoom: "cannot-join-specific-game-room",
      gameData: "game-data",
      playerAction: "player-action",
      getGameData: "get-game-data",
    },
  },
}
