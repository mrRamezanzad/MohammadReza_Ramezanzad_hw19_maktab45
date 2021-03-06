const User      = require('../models/user'),
      bcrypt    = require('bcrypt') 

exports.create  = async (userInfo, callback) => {
    if (typeof callback !== "function") {
        const func = this.create
        return new Promise((resolve, reject) => {
           func(userInfo, (err, result) => {
               if (err) return reject(err)
               resolve(result)
           })
        })
    }

    new User({
        firstName   : userInfo.firstName,
        lastName    : userInfo.lastName,
        username    : userInfo.username,
        password    : userInfo.password,
        gender      : userInfo.gender,
        mobile      : userInfo.mobile,

    }).save(callback)
}

exports.read = async (userId, callback = "") => {
    if (typeof callback !== "function") {
        const func = this.read
        return new Promise((resolve, reject) => {
            func (userId, (err, result) => {
                if (err) return reject(err)
                resolve(result)
            })
        })
    }

    let user
    try {user = await User.findById(userId)}
    catch (err) {return callback("مشکلی در پیدا کردن اطلاعات کابری بوجود آمده است.", user)}
    callback(null, user)
}

exports.update = async (userId, updatedUserInfo, callback) => {
    if (typeof callback !== "function") {
        const func = this.update
        return new Promise((resolve, reject) => {
           func(userId, updatedUserInfo, (err, result) => {
               if (err) return reject(err)
               resolve(result)
           })
        })
    }

    let user
    try {user = await User.findOneAndUpdate({_id: userId}, {$set: updatedUserInfo})}
    catch (err) {return callback(err, user)}
    callback(null, user)
}

exports.delete = async (userId, callback) => {
    if (typeof callback !== "function") {
        const func = this.delete
        return new Promise((resolve, reject) => {
           func(userId, (err, result) => {
               resolve(result)
           })
        })
    }

    let user
    try {user = await User.remove({_id: userId})} 
    catch (err) {return callback(err, false)}
    callback(null, true)
}

exports.comparePassword = async (userId, enteredPassword, callback) => {
    if (typeof callback !== "function") {
        const func = this.comparePassword
        return new Promise((resolve, reject) => {
           func(userId, enteredPassword, (err, result) => {
               if (err) return reject(err)
               resolve(result)
           })
        })
    }

    let user
    try {user = await this.read(userId)}
    catch (err) {return callback(err, false)}

    let isMatch 
    try{isMatch = await bcrypt.compare(enteredPassword, user.password)}
    catch(err){return callback(err, isMatch)}
    callback(null, isMatch)
}

exports.updatePassword = async (userId, newPassword, callback) => {
    if (typeof callback !== "function") {
        const func = this.updatePassword
        return new Promise((resolve, reject) => {
           func(userId, newPassword, (err, result) => {
               if (err) return reject(err)
               resolve(result)
           })
        })
    }

    let user
    try {user = await User.findById({_id: userId})}
    catch (err) {return callback(err, false)}

    user.password = newPassword
    try {user = await user.save()}
    catch (err) {return callback(err, false)}
    callback(null, true)
}