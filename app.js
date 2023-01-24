require('dotenv').config();
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("index")
  })


app.get('/artist-search', async (req, res) => {
    try {
        const data = await spotifyApi.searchArtists(req.query.name)
        // console.log(data.body.artists.items[0].images[0].url)
        res.render('artist-search-results', data.body.artists);
    } catch (error) {
      console.log(error)
    }
  });

app.get('/albums/:artistId', async (req, res, next) => {
    const {artistId} = req.params
    // console.log('this is the IDDDD',artistId)
    try {
        const data = await spotifyApi.getArtistAlbums(artistId)
        res.render('albums', data.body);
    } catch (error) {
        console.log(error)
    }
});

 app.get('/tracks/:artistId', async (req, res, next) => {
const {artistId} = req.params
// console.log('this is the IDDDD',artistId)
   try {
       const data = await spotifyApi.getAlbumTracks(artistId)
       console.log(data.body)
       res.render('tracks', data.body);
   } catch (error) {
     console.log(error)
   }
  });



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));