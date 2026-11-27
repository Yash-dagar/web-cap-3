// Fills the database with sample data for testing and demo
// run: npm run seed   (WARNING: deletes all old data first)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user.model.js');
const Pet = require('./models/pet.model.js');
const Application = require('./models/application.model.js');
const Favourite = require('./models/favourite.model.js');

const wiki = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Favourite.deleteMany();
        await Application.deleteMany();
        await Pet.deleteMany();
        await User.deleteMany();
        console.log('Old data removed');

        // all demo accounts use the same password
        const password = await bcrypt.hash('password123', 10);

        const admin = await User.create({ name: 'Admin', email: 'admin@pawhome.com', password, role: 'admin', city: 'Delhi' });

        const happyTails = await User.create({ name: 'Happy Tails Shelter', email: 'happytails@pawhome.com', password, role: 'shelter', phone: '9811012345', city: 'Delhi' });
        const secondChance = await User.create({ name: 'Second Chance Rescue', email: 'secondchance@pawhome.com', password, role: 'shelter', phone: '9876054321', city: 'Chandigarh' });

        const karan = await User.create({ name: 'Karan Mehta', email: 'karan@pawhome.com', password, role: 'adopter', phone: '9000011111', city: 'Delhi' });
        const isha = await User.create({ name: 'Isha Verma', email: 'isha@pawhome.com', password, role: 'adopter', phone: '9000022222', city: 'Gurugram' });
        const arjun = await User.create({ name: 'Arjun Nair', email: 'arjun@pawhome.com', password, role: 'adopter', phone: '9000033333', city: 'Chandigarh' });
        const pooja = await User.create({ name: 'Pooja Gill', email: 'pooja@pawhome.com', password, role: 'adopter', phone: '9000044444', city: 'Mohali' });
        console.log('Users created');

        // ---------- available pets ----------
        const available = await Pet.insertMany([
            { name: 'Bruno', species: 'Dog', breed: 'Labrador', age: 2, gender: 'Male', vaccinated: true, shelter: happyTails._id,
              description: 'Friendly and playful, loves fetch and long walks. Good with kids.',
              photoUrl: 'https://images.dog.ceo/breeds/labrador/n02099712_2174.jpg' },
            { name: 'Sheru', species: 'Dog', breed: 'Indian Pariah', age: 3, gender: 'Male', vaccinated: true, shelter: happyTails._id,
              description: 'Rescued from the street, very loyal and healthy. Great guard dog.',
              photoUrl: wiki + '4/46/Dog_00154.JPG/330px-Dog_00154.JPG' },
            { name: 'Bella', species: 'Dog', breed: 'Golden Retriever', age: 1, gender: 'Female', vaccinated: true, shelter: happyTails._id,
              description: 'Gentle puppy who loves cuddles. House trained.',
              photoUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_2358.jpg' },
            { name: 'Max', species: 'Dog', breed: 'Beagle', age: 4, gender: 'Male', vaccinated: false, shelter: secondChance._id,
              description: 'Curious nose, always exploring. Needs an active family.',
              photoUrl: 'https://images.dog.ceo/breeds/beagle/n02088364_16493.jpg' },
            { name: 'Coco', species: 'Dog', breed: 'Pug', age: 5, gender: 'Female', vaccinated: true, shelter: secondChance._id,
              description: 'Calm and lazy, perfect for an apartment.',
              photoUrl: 'https://images.dog.ceo/breeds/pug/n02110958_15014.jpg' },
            { name: 'Luna', species: 'Dog', breed: 'Siberian Husky', age: 2, gender: 'Female', vaccinated: true, shelter: secondChance._id,
              description: 'Energetic and talkative. Needs an AC room in summer.',
              photoUrl: 'https://images.dog.ceo/breeds/husky/n02110185_7210.jpg' },
            { name: 'Simba', species: 'Dog', breed: 'Shih Tzu', age: 6, gender: 'Male', vaccinated: true, shelter: happyTails._id,
              description: 'Senior boy looking for a quiet home.',
              photoUrl: 'https://images.dog.ceo/breeds/shihtzu/n02086240_5246.jpg' },
            { name: 'Misty', species: 'Cat', breed: 'Persian', age: 2, gender: 'Female', vaccinated: true, shelter: happyTails._id,
              description: 'Fluffy and calm, likes to sit by the window.',
              photoUrl: 'https://cdn2.thecatapi.com/images/24m.jpg' },
            { name: 'Oreo', species: 'Cat', breed: 'Siamese', age: 1, gender: 'Male', vaccinated: false, shelter: secondChance._id,
              description: 'Very vocal and loves attention.',
              photoUrl: 'https://cdn2.thecatapi.com/images/d3d.png' },
            { name: 'Tiger', species: 'Cat', breed: 'Bengal', age: 3, gender: 'Male', vaccinated: true, shelter: secondChance._id,
              description: 'Active climber, needs toys and space.',
              photoUrl: 'https://cdn2.thecatapi.com/images/7mc.gif' },
            { name: 'Leo', species: 'Cat', breed: 'Maine Coon', age: 4, gender: 'Male', vaccinated: true, shelter: happyTails._id,
              description: 'Big gentle giant, good with other cats.',
              photoUrl: 'https://cdn2.thecatapi.com/images/dav.jpg' },
            { name: 'Smokey', species: 'Cat', breed: 'Russian Blue', age: 2, gender: 'Female', vaccinated: true, shelter: secondChance._id,
              description: 'Shy at first, very sweet once she knows you.',
              photoUrl: 'https://cdn2.thecatapi.com/images/MTg0MjY0Mw.jpg' },
            { name: 'Snowy', species: 'Rabbit', breed: 'Holland Lop', age: 1, gender: 'Female', vaccinated: false, shelter: happyTails._id,
              description: 'Soft white bunny, eats carrots all day.',
              photoUrl: wiki + '6/66/Holland_Lop_Bunny_Standing_On_Her_Back_Feet.jpg/330px-Holland_Lop_Bunny_Standing_On_Her_Back_Feet.jpg' },
            { name: 'Fluffy', species: 'Rabbit', breed: 'Lionhead', age: 2, gender: 'Male', vaccinated: false, shelter: secondChance._id,
              description: 'Has a cute mane, likes to be brushed.',
              photoUrl: wiki + '6/6d/Lionhead_rabbit_Dobby.jpg/330px-Lionhead_rabbit_Dobby.jpg' },
            { name: 'Kiwi', species: 'Bird', breed: 'Budgerigar', age: 1, gender: 'Male', vaccinated: false, shelter: happyTails._id,
              description: 'Chirpy little budgie, comes with a cage.',
              photoUrl: wiki + '4/4a/Budgerigar-male-strzelecki-qld.jpg/330px-Budgerigar-male-strzelecki-qld.jpg' },
            { name: 'Mango', species: 'Bird', breed: 'Cockatiel', age: 2, gender: 'Female', vaccinated: false, shelter: secondChance._id,
              description: 'Can whistle a few tunes. Very friendly.',
              photoUrl: wiki + '8/8a/Cockatiel_3.jpg/330px-Cockatiel_3.jpg' }
        ]);

        // find a pet from the list above by name
        const pet = (name) => available.find((p) => p.name === name);

        // ---------- already adopted pets (for the monthly report) ----------
        const adoptedList = [
            { name: 'Rocky', species: 'Dog', breed: 'Labrador', age: 3, gender: 'Male', vaccinated: true, shelter: happyTails._id,
              photoUrl: 'https://images.dog.ceo/breeds/labrador/n02099712_2332.jpg', adopter: karan, date: '2026-07-12' },
            { name: 'Daisy', species: 'Dog', breed: 'Golden Retriever', age: 2, gender: 'Female', vaccinated: true, shelter: happyTails._id,
              photoUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_5642.jpg', adopter: isha, date: '2026-08-05' },
            { name: 'Kitty', species: 'Cat', breed: 'Indian Domestic', age: 1, gender: 'Female', vaccinated: true, shelter: secondChance._id,
              photoUrl: 'https://cdn2.thecatapi.com/images/GrPErz7EA.jpg', adopter: arjun, date: '2026-09-02' },
            { name: 'Buddy', species: 'Dog', breed: 'Beagle', age: 2, gender: 'Male', vaccinated: true, shelter: happyTails._id,
              photoUrl: 'https://images.dog.ceo/breeds/beagle/n02088364_13484.jpg', adopter: pooja, date: '2026-09-21' },
            { name: 'Shadow', species: 'Cat', breed: 'Bombay', age: 3, gender: 'Male', vaccinated: true, shelter: secondChance._id,
              photoUrl: 'https://cdn2.thecatapi.com/images/7mf.jpg', adopter: karan, date: '2026-10-09' },
            { name: 'Pepper', species: 'Dog', breed: 'Pug', age: 4, gender: 'Female', vaccinated: true, shelter: happyTails._id,
              photoUrl: 'https://images.dog.ceo/breeds/pug/n02110958_6098.jpg', adopter: isha, date: '2026-10-27' },
            { name: 'Tommy', species: 'Dog', breed: 'Labrador', age: 1, gender: 'Male', vaccinated: true, shelter: secondChance._id,
              photoUrl: 'https://images.dog.ceo/breeds/labrador/fury_01.jpg', adopter: arjun, date: '2026-11-15' }
        ];

        for (const item of adoptedList) {
            const adoptedPet = await Pet.create({
                name: item.name,
                species: item.species,
                breed: item.breed,
                age: item.age,
                gender: item.gender,
                vaccinated: item.vaccinated,
                photoUrl: item.photoUrl,
                description: 'Adopted and living happily with a new family.',
                shelter: item.shelter,
                status: 'adopted',
                adoptedBy: item.adopter._id,
                adoptedAt: new Date(item.date)
            });

            await Application.create({
                pet: adoptedPet._id,
                adopter: item.adopter._id,
                shelter: item.shelter,
                message: 'I have a big house with a garden and I can take good care of ' + item.name + '.',
                status: 'approved',
                decidedAt: new Date(item.date)
            });

            // Rocky also had one more applicant who got rejected
            if (item.name === 'Rocky') {
                await Application.create({
                    pet: adoptedPet._id,
                    adopter: pooja._id,
                    shelter: item.shelter,
                    message: 'I would love to adopt Rocky, I work from home.',
                    status: 'rejected',
                    decidedAt: new Date(item.date)
                });
            }
        }

        // ---------- pending applications ----------
        await Application.create([
            { pet: pet('Bella')._id, adopter: pooja._id, shelter: happyTails._id, status: 'pending',
              message: 'I grew up with a golden retriever and have time to train a puppy.' },
            { pet: pet('Bella')._id, adopter: arjun._id, shelter: happyTails._id, status: 'pending',
              message: 'Our family is looking for a friendly dog for our kids.' },
            { pet: pet('Misty')._id, adopter: karan._id, shelter: happyTails._id, status: 'pending',
              message: 'I live alone in a quiet flat, perfect for a calm cat like Misty.' },
            { pet: pet('Snowy')._id, adopter: isha._id, shelter: happyTails._id, status: 'pending',
              message: 'I have kept rabbits before and have a big hutch ready.' },
            { pet: pet('Luna')._id, adopter: karan._id, shelter: secondChance._id, status: 'pending',
              message: 'I go running every morning and want an active dog.' }
        ]);

        // ---------- favourites ----------
        await Favourite.create([
            { user: karan._id, pet: pet('Bella')._id },
            { user: karan._id, pet: pet('Luna')._id },
            { user: karan._id, pet: pet('Oreo')._id },
            { user: isha._id, pet: pet('Snowy')._id },
            { user: isha._id, pet: pet('Kiwi')._id },
            { user: pooja._id, pet: pet('Max')._id }
        ]);

        console.log('Pets, applications and favourites created');
        console.log('---------------------------------------');
        console.log('Login with any of these (password: password123)');
        console.log('admin@pawhome.com');
        console.log('happytails@pawhome.com, secondchance@pawhome.com');
        console.log('karan@pawhome.com, isha@pawhome.com, arjun@pawhome.com, pooja@pawhome.com');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.log('Seed failed: ' + error.message);
        process.exit(1);
    }
};

seed();
