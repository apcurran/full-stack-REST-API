module.exports = function(mainObj) {
    let objClone = {};
    let key;
 
    for (key in mainObj) {
       if (mainObj[key] === null || mainObj[key] === "null") {
          continue;
       } else {
          objClone[key] = mainObj[key];
       }
    }
 
    return objClone;
}