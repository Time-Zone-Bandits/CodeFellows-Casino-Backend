const jsonwebtoken = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

function verifyUser(request, response, next) {
    try {
        console.log(request.headers);
        //front-end gets this from withAuth0 props and adds it to header
        const token = request.headers.authorization.split(' ')[1]; // gets the part after 'Bearer'
        jsonwebtoken.verify(token, getKey, {}, (error, user) => {
            //takes token and key, uses those to get user which is sent to this call back
            request.user = user;
            //user property is added to every request with this middleware
            next();//calls the next middleware after this one
        })
    } catch (error) {
        next('Not Authorized');
    }
}


// need getKey function for the jwt verify
function getKey(header, callback) {
    //jwks URI is Auth0 domain
    const client = jwksClient({jwksUri: process.env.JWKS_URI});  
    //kid is Key Identifier, help sit determine which key to "sign" token with
    client.getSigningKey(header.kid, (error, key) => {
        //getSigningKey uses kid to choose key then sends it to callback:
        const signingKey = ((key.publicKey) || key.rsaPublicKey); //rsa is a differnet crypto format
        callback(null, signingKey); //this is what jwt verify needs
    });
}

module.exports = verifyUser;