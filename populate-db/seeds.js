// Specified database as argument - e.g.: seeds.js mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/my_cool_project?retryWrites=true')

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

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function randomIntFromRange(low, high) {
    return Math.floor(Math.random() * high) + low;
}

async function populateDb() {
    try {

        for (let i = 0; i < 50; i++) {
            const home = await new House({
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
                agent: faker.name.findName(),
                agent_img: faker.image.avatar(),
                house_img_main: "https://source.unsplash.com/800x600/?house",
                house_img_inside_1: "https://source.unsplash.com/800x600/?kitchen,living",
                house_img_inside_2: "https://source.unsplash.com/800x600/?kitchen,living",
            });
    
            await home.save();
        }
    
        console.log("DB populated!");
        
    } catch (err) {
        console.error(err);
    }
}

// populateDb();