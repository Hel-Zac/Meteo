var unirest = require('unirest');
var express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var fs=require('fs');
var list_cities=fs.readFileSync('city_list.json', 'utf8');
list_cities=JSON.parse(list_cities);//liste de toutes les villes de l'api

number_city = list_cities.lengh;
var random = Math.floor(Math.random() * number_city)//tirer au sort un numéro pour voir quelle ville afficher
city_view = list_cities[random];//charger la ville
console.log(city_view);//vérifier que la ville est la bonne
city_name = city_view.name + ", " + city_view.country;//former une chaine de caractères pour avoir les informations de la bonne ville

app.use(express.static('public'));
app.get('/', function(req, res){
unirest.get("https://community-open-weather-map.p.rapidapi.com/find")//demande les informations à l'api
  .header("x-rapidapi-key", '76365ce905msh74b1f18ab4d74bdp18eb77jsnfe25b1f762c5')
  .header("x-rapidapi-host", "community-open-weather-map.p.rapidapi.com")
  .query({
        'q': city_name,
        'units': 'metric',
        'cnt':1
  })
  .end(function (result) {
        res.sendFile(__dirname + '/meteo.html');
        console.log('info: ' + {data:result.body});
        io.emit('info', {data:result.body});//envoyer ces informations aux clients
  });
})
server.listen(3000, function()
{
  console.log('Server running at https://127.0.0.1:3000/');
})

