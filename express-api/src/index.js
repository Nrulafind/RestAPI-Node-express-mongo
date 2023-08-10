const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();

const { startDatabase } = require('./database/mongo');
const { insertAd, getAds, deleteAd, updateAd } = require('./database/ads');

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

//console.log(jwt);

async function jwtHandler() {
    const checkJwt = ({
        secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: 'https://dev-sr45l575l8055q84.auth0.com/.well-known/jwks.json'
        }),

        // Validate the audience and the issuer.
        audience: 'https://dev-sr45l575l8055q84.us.auth0.com/api/v2/',
        issuer: 'https://dev-sr45l575l8055q84.auth0.com/',
        algorithms: ['RS256']
    });
    return checkJwt;
}

//app.use(jwtHandler);

app.get('/', jwtHandler, async (req, res) => {
    res.send(await getAds());
});

app.post('/', async (req, res) => {
    const newAd = req.body;
    await insertAd(newAd);
    res.send({ message: 'New Ad successfully' });
});

app.delete('/:id', async (req, res) => {
    await deleteAd(req.params.id);
    res.send({ message: 'Ad removed successfully' });
});

app.put('/:id', async (req, res) => {
    const updatedAd = req.body;
    await updateAd(req.params.id, updatedAd);
    res.send({ message: 'Ad updated succesfully' });
})

startDatabase().then(async () => {
    await insertAd({ title: 'Hello, now from the in-memory database!' });

    // start the server
    app.listen(3001, () => {
        console.log('listening on port 3001');
    });
});
