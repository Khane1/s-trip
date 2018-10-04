module.exports = {
    //i have created new app inside developer.facebook.com  then copy z id and app secret
    facebook: {
        clientID: '208035149799213', //field 
        clientSecret: 'b3274c4bbe69ff19d6850fe9930d985d', 
        // profileFields: ['email','displayName','photos'],//profile users
        // callbackURL: 'http://localhost:3000/auth/facebook/callback',
        // passReqCallback: true //allow us to pass z data to call back when users try to login //tp check the user exist in db
    },
//i have created new app inside google developer console  then copy z id and app secret
    google: {
        clientID: '382761604614-6a78mseh99nd2orlj34jp327jnitpsld.apps.googleusercontent.com',
        clientSecret: 'Qw9CyQWh3-IA_YaNHY3z-3qu',
        
    }
}
//when deploy as  envirument variable then set => secret key,id 