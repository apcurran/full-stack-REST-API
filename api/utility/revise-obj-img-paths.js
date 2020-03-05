"use strict";

module.exports = function(obj, req, bodyObj) {
    let fileObj = {};

    for (const [key, value] of Object.entries(obj)) {
        if (key === "agent_img") {
            fileObj[key] = `${process.env.SERVER_URL_PRE}/${req.files.agent_img[0].path}`;
        } else if (key === "house_img_main") {
            fileObj[key] = `${process.env.SERVER_URL_PRE}/${req.files.house_img_main[0].path}`;
        } else if (key === "house_img_inside_1") {
            fileObj[key] = `${process.env.SERVER_URL_PRE}/${req.files.house_img_inside_1[0].path}`;
        } else if (key === "house_img_inside_2") {
            fileObj[key] = `${process.env.SERVER_URL_PRE}/${req.files.house_img_inside_2[0].path}`;
        }
    }

    return {
        ...bodyObj,
        ...fileObj
    }
}