var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var dbConfig=require('./dbconfig');
var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    admin: Boolean,
    fullName:String,
    company:String,
    userPicName:String,
    experience:String,
    skills:String,
    token:String,
    userCollection:String,
    customImage:{
        type: String,
        required: true
    },
    portNumber:String
});

userSchema.methods.company = function(company){
    this.company = company;
}

userSchema.methods.experience = function(experience){
    this.experience = experience;
}

userSchema.methods.skills = function(skills){
    this.skills = skills;
}


userSchema.methods.username = function(lastName){
    this.lastName = lastName;
};


userSchema.methods.setFullName = function(fullName){
    this.fullName = fullName;
}

userSchema.methods.getFullName = function(){
    return this.fullName ;
}


userSchema.methods.setEmailAddress = function(email){
    this.email = email;
};
userSchema.methods.getEmailAddress = function(){
    return this.email ;
};

userSchema.methods.setCustomImage = function(){
    return this.customImage ;
};

userSchema.methods.getCustomImage = function(){
    return this.customImage ;
};


userSchema.methods.getCollection = function(){
    return this.userCollection ;
};
userSchema.methods.setCollection = function(){
    this.userCollection=this.email.replace("@", "").replace(".com","collection");
    return this.userCollection;
};
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    console.log("reached here");
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
    return this.hash === hash;
};
userSchema.methods.buildUser=function(item){
    this.firstName = item.firstName;
    this.lastName = item.lastName;
    this.fullName = item.fullName;
    this.email = item.email;
    this.company = item.company;
    this.userPicName = item.userPicName;
    this.skills = skills;
    this.experience = experience;
    this.name=item.name;
    this.userCollection=item.userCollection;
    this.portNumber=item.portNumber;
}

userSchema.methods.generateJwt = function() {
    var token = jwt.sign(this, "test", {
        expiresIn: 3600 // expires in 24 hours
    });
    this.token=token;
    //return jwt.sign({
    //    _id: this._id,
    //    email: this.email,
    //    name: this.name,
    //    exp: 1440
    //}, dbConfig.secret); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('UserProfile', userSchema);
