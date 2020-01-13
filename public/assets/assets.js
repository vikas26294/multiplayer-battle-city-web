// bullets
var bullets = require("./bullets")

// terrains
var brick = require("../images/resources/blocks/terrain/brick.png")
var brick_mini = require("../images/resources/blocks/terrain/mini_brick.png")
var brick_small = require("../images/resources/blocks/terrain/small_brick.png")
var deadflag = require("../images/resources/blocks/terrain/deadflag.png")
var deepsea = require("../images/resources/blocks/terrain/deepsea.png")
var eagle = require("../images/resources/blocks/terrain/eagle.png")
var fence_small = require("../images/resources/blocks/terrain/small_fence.png")
var forest = require("../images/resources/blocks/terrain/forest.png")
var forest_small = require("../images/resources/blocks/terrain/small_forest.png")
var iron = require("../images/resources/blocks/terrain/iron.png")
var iron_small = require("../images/resources/blocks/terrain/small_iron.png")
var sea = require("../images/resources/blocks/terrain/sea.png")
var steel = require("../images/resources/blocks/terrain/steel.png")
var steel_small = require("../images/resources/blocks/terrain/small_steel.png")
var void_small = require("../images/resources/blocks/terrain/small_void.png")
var empty = require("../images/resources/blocks/terrain/void.png")

module.exports = {
  bullets: bullets,
  terrain: {
    brick: brick,
    brick_mini: brick_mini,
    brick_small: brick_small,
    deadflag: deadflag,
    deepsea: deepsea,
    eagle: eagle,
    fence_small: fence_small,
    forest: forest,
    forest_small: forest_small,
    iron: iron,
    iron_small: iron_small,
    sea: sea,
    steel: steel,
    steel_small: steel_small,
    void_small: void_small,
    empty: empty,
  },
}
