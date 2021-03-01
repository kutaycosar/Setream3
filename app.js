const express = require('express')
let mongodb = require('mongodb')

let app = express()
let db
let data 

let port = process.env.PORT
if (port == null || port == "") {
    port = 8000
}

app.use(express.static('public')) //public folderini kullanicaz

let connectionString = 'mongodb://todoAppUser:0024882aaa@cluster0-shard-00-00.m1hmo.mongodb.net:27017,cluster0-shard-00-01.m1hmo.mongodb.net:27017,cluster0-shard-00-02.m1hmo.mongodb.net:27017/Setream?ssl=true&replicaSet=atlas-tj1li7-shard-0&authSource=admin&retryWrites=true&w=majority'

mongodb.connect(connectionString, {useNewUrlParser: true}, function(err, client){
    db = client.db()
    app.listen(8000) // db olusturuldugunda portu dinlemeye baslar
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('views', 'views') //views larin yerini gosteriyoruz expresse
app.set('view engine', 'ejs') //view enginemizin ejs oldugunu soyluyoruz

function passwordProtected(req, res, next){
    res.set('WWW-Authenticate', 'Basic realm="Setream app"')
    if (req.headers.authorization == "Basic c2V0YWRtaW46NDMyMTA=") {
       next() 
    }else{
        res.status(401).send("Yanlış şifre girildi")
    }
}

app.get('/', function(req,res){
    res.render('anasayfa.ejs')
})

app.get('/yorumlar',passwordProtected, function(req,res){
    db.collection('items').find().sort({_id:-1}).toArray(function(err, items){
      res.render('yorumlar.ejs', {
          data: items
      })  
    })
    
})




app.post('/create-item',function(req,res){
    date = new Date()
    data = {
        text: req.body.text,
        yorum: req.body.text2,
        date: date.toLocaleString()
    }

    db.collection('items').insertOne(data, function(err, info){
        res.json(info.ops[0])
    })
    
})

app.post('/delete-item', function(req, res) {
    db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
      res.send("Success")
    })
  })

