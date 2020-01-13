const socketConfig = {
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
}

const spriteBlockSize = 8
const gameConfig = {
  default: {
    homeBase: {
      x: 12,
      y: 24,
    },
    directions: {
      up: "u",
      down: "d",
      left: "l",
      right: "r",
    },
  },
  sprite: {
    src: "/images/resources/sprites/nes_battle_city_general_sprite_sheet.png",
    width: 400,
    height: 256,
  },
  assets: {
    p1: {
      "0": {
        1: {
          1: {
            x: spriteBlockSize * 0,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 0,
            y: spriteBlockSize * 2,
          },
        },
      },
      "90": {
        1: {
          1: {
            x: spriteBlockSize * 4,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 4,
            y: spriteBlockSize * 2,
          },
        },
      },
      "180": {
        1: {
          1: {
            x: spriteBlockSize * 8,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 8,
            y: spriteBlockSize * 2,
          },
        },
      },
      "270": {
        1: {
          1: {
            x: spriteBlockSize * 12,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 12,
            y: spriteBlockSize * 2,
          },
        },
      },
    },
    p2: {
      "0": {
        1: {
          1: {
            x: spriteBlockSize * 16,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 16,
            y: spriteBlockSize * 2,
          },
        },
      },
      "90": {
        1: {
          1: {
            x: spriteBlockSize * 20,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 20,
            y: spriteBlockSize * 2,
          },
        },
      },
      "180": {
        1: {
          1: {
            x: spriteBlockSize * 24,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 24,
            y: spriteBlockSize * 2,
          },
        },
      },
      "270": {
        1: {
          1: {
            x: spriteBlockSize * 28,
            y: spriteBlockSize * 0,
          },
          2: {
            x: spriteBlockSize * 28,
            y: spriteBlockSize * 2,
          },
        },
      },
    },
    ".": {
      // void
      x: spriteBlockSize * 43,
      y: spriteBlockSize * 0,
    },
    "#": {
      // brick
      x: spriteBlockSize * 32,
      y: spriteBlockSize * 0,
    },
    "@": {
      // steel
      x: spriteBlockSize * 32,
      y: spriteBlockSize * 2,
    },
    "%": {
      // forest
      x: spriteBlockSize * 34,
      y: spriteBlockSize * 4,
    },
    "~": {
      // deep sea
      x: spriteBlockSize * 32,
      y: spriteBlockSize * 4,
    },
    "-": {
      // iron
      x: spriteBlockSize * 36,
      y: spriteBlockSize * 4,
    },
    homeBase: {
      x: spriteBlockSize * 38,
      y: spriteBlockSize * 4,
    },
    homeBaseOver: {
      x: spriteBlockSize * 40,
      y: spriteBlockSize * 4,
    },
  },
  spriteBlockSize: spriteBlockSize,
  ssp: 24, // stage to screen pixel
}
