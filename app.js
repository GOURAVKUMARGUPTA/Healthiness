const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

app.use(express.static('public'));

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/parallax1.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/about.html'));
});

router.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/login.html'));
});


//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
