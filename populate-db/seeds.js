// Specified database as argument - e.g.: node seeds.js mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/my_cool_project?retryWrites=true'

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

const House = require("../api/models/House");
const faker = require("faker");
const fetch = require("node-fetch");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
const mongoConnection = mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function randomIntFromRange(low, high) {
    return Math.floor(Math.random() * high) + low;
}

async function populateDb() {
    try {

        let homeArrPromises = [];

        for (let i = 0; i < 75; i++) {
            // Agent info using Random User gen API
            const agentInfoResponse = await fetch("https://randomuser.me/api/?format=json&inc=name,picture&nat=us,gb");
            const agentInfoData = await agentInfoResponse.json();
            const results = agentInfoData.results;
            const agentFirstName = results[0].name.first;
            const agentLastName = results[0].name.last;
            const agentThumbnail = results[0].picture.large;

            const home = new House({
                price: randomIntFromRange(150000, 600000),
                street: faker.address.streetAddress(),
                city: faker.address.city(),
                state: faker.address.state(),
                zip: faker.address.zipCode(),
                lat: faker.address.latitude(),
                lon: faker.address.longitude(),
                bedrooms: randomIntFromRange(1, 4),
                bathrooms: randomIntFromRange(1, 3),
                squareFeet: randomIntFromRange(1500, 4000),
                description: faker.lorem.paragraph(),
                agent: `${agentFirstName} ${agentLastName}`,
                agent_img: agentThumbnail,
                agent_phone: faker.phone.phoneNumberFormat(),
                house_img_main: `https://source.unsplash.com/${randomIntFromRange(700, 900)}x${randomIntFromRange(600, 700)}/?house`,
                house_img_inside_1: "https://source.unsplash.com/800x600/?kitchen,living",
                house_img_inside_2: "https://source.unsplash.com/799x600/?kitchen,living",
            });
    
            homeArrPromises.push(home.save());
        }
    
        await Promise.all(homeArrPromises);
        console.log("DB populated!");
        mongoConnection.disconnect();
        
    } catch (err) {
        console.error(err);
    }
}

populateDb();