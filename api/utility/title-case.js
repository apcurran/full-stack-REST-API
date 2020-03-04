"use strict";

module.exports = function(str) {
    return str.replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
}