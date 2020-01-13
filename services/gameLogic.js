const config = require("../config/")

const movePlayer = ({ gameRoomInfo, member, direction }) => {
  const { stage, lineBreak } = gameRoomInfo
  let x = parseInt(gameRoomInfo[`p${member}PosX`])
  let y = parseInt(gameRoomInfo[`p${member}PosY`])
  let oldAngle = parseInt(gameRoomInfo[`p${member}Angle`])

  // surrounding pixels
  const sps = _getSurroundingPixels({ stage, x, y, lineBreak })

  // new angle
  let newAngle = 0

  // player direction
  switch (direction) {
    case config.default.directions.up: // up
      switch (oldAngle / 90) {
        case 0: // up
          if (_canPlayerMoveUp({ stage, lineBreak, x, y, sps })) y -= 1
      }
      newAngle = 0
      break

    case config.default.directions.down: // down
      switch (oldAngle / 90) {
        case 2: // down
          if (_canPlayerMoveDown({ stage, lineBreak, x, y, sps })) y += 1
      }
      newAngle = 180
      break

    case config.default.directions.left: // left
      switch (oldAngle / 90) {
        case 1: // down
          if (_canPlayerMoveLeft({ stage, lineBreak, x, y, sps })) x -= 1
      }
      newAngle = 90
      break

    case config.default.directions.right: // right
      switch (oldAngle / 90) {
        case 3: // down
          if (_canPlayerMoveRight({ stage, lineBreak, x, y, sps })) x += 1
      }
      newAngle = 270
      break
  }

  return { x, y, newAngle }
}

// can player move up
const _canPlayerMoveUp = ({ stage, lineBreak, x, y, sps }) => {
  if (y === 0) return false

  // u1
  if (config.assets.blockers.includes(sps.u1)) return false
  // u2
  if (config.assets.blockers.includes(sps.u2)) return false

  return true
}

// can player move down
const _canPlayerMoveDown = ({ stage, lineBreak, x, y, sps }) => {
  if (y === lineBreak - 2) return false

  // d1
  if (config.assets.blockers.includes(sps.d1)) return false
  // d2
  if (config.assets.blockers.includes(sps.d2)) return false

  return true
}

// can player move left
const _canPlayerMoveLeft = ({ stage, lineBreak, x, y, sps }) => {
  if (x === 0) return false

  // l1
  if (config.assets.blockers.includes(sps.l1)) return false
  // l2
  if (config.assets.blockers.includes(sps.l2)) return false

  return true
}

// can player move right
const _canPlayerMoveRight = ({ stage, lineBreak, x, y, sps }) => {
  if (x === lineBreak - 2) return false

  // r1
  if (config.assets.blockers.includes(sps.r1)) return false
  // r2
  if (config.assets.blockers.includes(sps.r2)) return false

  return true
}

// surrounding pixels
const _getSurroundingPixels = ({ stage, x, y, lineBreak }) => {
  let response = {}

  // u1
  let u1 = (y - 1) * lineBreak + x
  response.u1 = u1 >= 0 && u1 < stage.length ? stage[u1] : "X"

  // u2
  let u2 = u1 + 1
  response.u2 = u2 >= 0 && u2 < stage.length ? stage[u2] : "X"

  // l1
  let l1 = y * lineBreak + (x - 1)
  response.l1 = l1 >= 0 && l1 < stage.length ? stage[l1] : "X"

  // l2
  let l2 = (y + 1) * lineBreak + (x - 1)
  response.l2 = l2 >= 0 && l2 < stage.length ? stage[l2] : "X"

  // r1
  let r1 = y * lineBreak + (x + 2)
  response.r1 = r1 >= 0 && r1 < stage.length ? stage[r1] : "X"

  // r2
  let r2 = (y + 1) * lineBreak + (x + 2)
  response.r2 = r2 >= 0 && r2 < stage.length ? stage[r2] : "X"

  // d1
  let d1 = (y + 2) * lineBreak + x
  response.d1 = d1 >= 0 && d1 < stage.length ? stage[d1] : "X"

  // d2
  let d2 = d1 + 1
  response.d2 = d2 >= 0 && d2 < stage.length ? stage[d2] : "X"

  return response
}

module.exports = {
  movePlayer,
}
