const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  nome: String,
  codigo: String
}, { timestamps: true });

StatusSchema.statics.getAll = function(callback, context) {
    this.find({}, function(err, doc) {
       callback(doc,err,context);
    });
};

StatusSchema.statics.get = function(id,callback, context) {
    this.findById(id, function (err, doc) {
       callback(doc,err,context);
    });
};

StatusSchema.statics.getByCod = function(id,callback, context) {
    this.findOne({codigo: id}, function (err, doc) {
       callback(doc,err,context);
    });
};

StatusSchema.statics.add = function(nome, codigo, callback, context) {
    var newSta = new this({nome:nome, codigo:codigo})
    newSta.save(function (err, mData) {
        if (err) callback(false,err,context);
        callback(mData,false,context);
    });
};

StatusSchema.statics.del = function(id, callback, context) {
    this.findByIdAndRemove(id,function(err, mData) {
    	callback(mData,err,context);
    })
};

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;
