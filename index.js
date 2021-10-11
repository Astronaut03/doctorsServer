const express = require('express')
const { MongoClient } = require('mongodb');
//const {ObjectId} = require('mongodb');
//const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kaept.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload());

const port = 5000;




app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const appointmentCollection = client.db("doctorsPortel").collection("appointments");
  // perform actions on the collection object
  //client.close();
const doctorCollection = client.db("doctorsPortel").collection("doctors");

  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
});

// app.get('/appointments', (req, res) => {
app.get('/allPatients', (req, res) => {
    appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

app.get('/appointments', (req, res) => {

        appointmentCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

app.post('/appointmentByDate', (req, res) => {
    const date = req.body;
    const email = req.body.email;
    doctorCollection.find({email: email})
    //doctor der email collect/checking korteche mongodb theke//
    .toArray((err, doctors) => {
        const filter = {date: date.date}
        if(doctors.length === 0){
            filter.email = email;
        }

        appointmentCollection.find(filter)
        .toArray((err, documents) => {
        res.send(documents);
    })
    })
    
})

app.post('/addADoctor', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;

    // const newImg = file.data;
    //     const encImg = newImg.toString('base64');

  
    
    //const filePath = `${__dirname}/doctors/${file.name}`;
    // file.mv(filePath, err => {
    //     if(err){
    //         console.log(err);
    //         res.status(500).send({msg: 'failed to upload image'});
    //     }

        //const newImg = fs.readFileSync(filePath);
        //const newImg = req.files.file.data;
        const newImg = file.data;


        const encImg = newImg.toString('base64');

        var image = {
        //contentType: req.files.file.mimetype,
        //size: req.files.file.size,
        contentType: file.mimetype,
        size: file.size,

        img: Buffer.from(encImg, 'base64')
        };

        doctorCollection.insertOne({ name, email, image})
        .then(result => {
            // fs.remove(filePath, error => {
            //     if(error) {
            //     console.log(error);
            //     res.status(500).send({msg: 'failed to upload image'});
            //     }
                res.send(result.insertedCount > 0);
            //})
           
        })
    //})


})

app.get('/doctors', (req, res) => {
    doctorCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
});

app.post('/isDoctor', (req, res) => {
    const email = req.body.email;
    doctorCollection.find({email: email})
    .toArray((err, doctors) => {
        res.send(doctors.length >0)

    })
    
});

});


app.listen(process.env.PORT || port)