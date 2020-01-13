// promise
const Promise = require("Bluebird")
const fs = require("fs")
const path = require("path")
const stageFolder = path.join(__dirname, "..", "stages")

module.exports = {
  /** Load stage */
  loadStage(stageNumber) {
    return new Promise(function(resolve, reject) {
      fs.readFile(
        path.resolve(`${stageFolder}/${stageNumber}.txt`),
        { encoding: "utf8" },
        (err, data) => {
          if (err) reject(err)

          resolve({
            stage: data.replace(/\n/g, ""),
            lineBreak: data.indexOf("\n"),
          })
        }
      )
    })
  },
}
