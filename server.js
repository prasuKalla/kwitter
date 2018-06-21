var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var app = express();

var JWT_SECRET = 'kwitterkwitter'

MongoClient.connect("mongodb://localhost:27017/chatDb", function(err, db){
    if(!err){
        console.log("we are connected!");
        db = dbconn;
    }
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req, res, next){

     db.collection('chats', function(err, chatCollection){
         chatCollection.find().toArray(function(err, chats){
             //console.log(chats);
             return res.json(chats);
         });
     });

  res.send(chats);
});

app.post('/chats', function(req, res, next){

    var token = req.headers.authorization;
    //console.log(token);
    
    var user = jwt.decode(token, JWT_SECRET);
   
    db.collection('chats', function(err, chatCollection){
       
        var newChat ={
            text: req.body.newChat,
            user: user_id,
            username: user.username
        };

        chatCollection.insert(newChat, {w:1}, function(err, chats){
           // console.log(chats);
            return res.send();
        });
    });
  
});

app.put('/chats/remove', function(req, res, next){
    
    var token = req.headers.authorization;
    //console.log(token);
    
    var user = jwt.decode(token, JWT_SECRET);

    db.collection('chats', function(err, chatCollection){
        
        var chatId = req.body.chat._id;
        chatCollection.remove(
            {
                _id: ObjectId(chatId),
                 user: user._id
            }, 
            {w:1}, function(err, chats){
            //console.log(chats);
            return  res.send();
        });
    });
   
});

app.post('/users', function(req, res, next){
    
    db.collection('users', function(err, usersCollection){
       
        bcrypt.genSalt(10 , function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                // Store hash in your password DB.
                var newUser = {
                    username: req.body.username,
                    password: hash
                };

                usersCollection.insert(newUser, {w:1}, function(err, chats){
                  //  console.log(users);
                    return res.send();
                });
            });
        });  
        
    });
  
});

app.post('/users/signin', function(req, res, next){
    
    db.collection('users', function(err, usersCollection){
       

        usersCollection.findOne({username: req.body.username}, function(err, chats){
           
            // Load hash from your password DB.
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                   if(result){
                    var token = jwt.encode(user, JWT_SECRET);
                     return res.json({ token: token});
                   }
                   else{
                     return res.status(400).send();
                   }
                });
        });


        bcrypt.genSalt(10 , function(err, salt) {

            bcrypt.hash(req.body.password, salt, function(err, hash) {
                // Store hash in your password DB.

                var newUser = {
                    username: req.body.username,
                    password: hash
                };

                usersCollection.insert(newUser, {w:1}, function(err, chats){
                  //  console.log(users);
                    return res.send();
                });
            });
        });  
        
    });
  
});




app.listen(3000, function(){
    console.log('app listening on port 3000!');
});