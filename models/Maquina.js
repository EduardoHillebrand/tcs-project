const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const MaquinaSchema = new mongoose.Schema({
  nome: String,
  codigo: String,
  status: String
}, { timestamps: true });


MaquinaSchema.statics.getAll = function(callback, context) {
    this.find({}, function(err, doc) {
       callback(doc,err,context);
    });
};

MaquinaSchema.statics.getLast = function(callback, context) {
    this.find({}).sort('updatedAt').limit(1).exec(function (err, doc) {
       callback(doc[0],err,context);
    });
};

MaquinaSchema.statics.get = function(id,callback, context) {
    this.findById(id, function (err, doc) {
       callback(doc,err,context);
    });
};

MaquinaSchema.statics.getByCod = function(id,callback, context) {
    this.findOne({codigo: id}, function (err, doc) {
       callback(doc,err,context);
    });
};

MaquinaSchema.statics.add = function(nome, codigo, status, callback, context) {
    var newMaq = new this({nome:nome, codigo:codigo, status:status})
    newMaq.save(function (err, mData) {
        mData.codigo = mData._id;
        mData.save();
        if (err) callback(false,err,context);
        callback(mData,false,context);
    });
};

MaquinaSchema.statics.del = function(id, callback, context) {
    this.findByIdAndRemove(id,function(err, mData) {
    	callback(mData,err,context);
    })
};




const Maquina = mongoose.model('Maquina', MaquinaSchema);

module.exports = Maquina;
