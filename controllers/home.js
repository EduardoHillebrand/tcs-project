const modelMaquina = require('../models/Maquina');
const modelStatus = require('../models/Status');

/**
 * Test pages.
 **/

 /* maquina */
exports.index = (req, res) => {
	modelMaquina.getAll(function(mData, err) {
		res.render('TCS/mRead', {
	    	title: 'Home',
	    	maquinas: mData || []
	  	});
	})
};

exports.mCreate = (req, res) => {
  res.render('TCS/mCreate', {
    title: 'Home'
  });
};

exports.mCreatePost = (req, res) => {
	if(req.body.nome)
		modelMaquina.add(req.body.nome ,null,null, function(mData, err) {
			res.redirect('/');
		})
	else
		res.render('TCS/mCreate', {
		    title: 'Home'
		  });
};

exports.mUpdate = (req, res) => {
	modelMaquina.get(req.params.cod,function(mData,err,context) {
	  	res.render('TCS/mUpdate', {
	    	title: 'Home',
	    	data: mData
	  	});
  })
  
};
exports.mUpdatePost = (req, res) => {
  modelMaquina.get(req.params.cod,function(mData,err,context) {

  	mData.nome = req.body.nome != '' ? req.body.nome : mData.nome;
  	mData.codigo = req.body.codigo != '' ? req.body.codigo : mData.codigo;
  	mData.save(function(err,doc) { 		
  		res.redirect('/');
  	})

  })
};

exports.mDelete = (req, res) => {
  modelMaquina.del(req.params.cod,function(mData,err,context) {
  	res.redirect('/');
  })
};



/* status */
exports.status = (req, res) => {
	modelStatus.getAll(function(mData, err) {
  		res.render('TCS/sRead', {
	    title: 'Status',
	    status: mData || []
	  });
  	});
};

exports.sCreate = (req, res) => {
  res.render('TCS/sCreate', {
    title: 'Status'
  });
};

exports.sCreatePost = (req, res) => {
	if(req.body.nome)
		modelStatus.add(req.body.nome ,req.body.codigo, function(mData, err) {
			res.redirect('/status');
		})
	else
		res.render('TCS/sCreate', {
		    title: 'Status'
		});
};


exports.sUpdate = (req, res) => {
	modelStatus.get(req.params.cod,function(mData,err,context) {
	  	res.render('TCS/sUpdate', {
	    	title: 'Status',
	    	data: mData
	  	});
  	})
  
};

exports.sUpdatePost = (req, res) => {
	modelStatus.get(req.params.cod,function(mData,err,context) {
	  	mData.nome = req.body.nome != '' ? req.body.nome : mData.nome;
	  	mData.codigo = req.body.codigo != '' ? req.body.codigo : mData.codigo;
	  	mData.save(function(err,doc) { 		
	  		res.redirect('/status');
	  	})
	})
};

exports.sDelete = (req, res) => {
  modelStatus.del(req.params.cod,function(mData,err,context) {
  	res.redirect('/status');
  })
};

/* status/maquina rotas*/

exports.statusMaquinaGet = (req, res) => {
	modelStatus.getAll(function(status, err) {
		var objStatus = {};
		for (var i = 0; i < status.length; i++) {
			objStatus[status[i].codigo] = status[i].nome;
		}

  		modelMaquina.getAll(function(maquinas, err, objStatus) {
  			var arr = [];
  			for (var i = 0; i < maquinas.length; i++) {
  				arr.push({ m: maquinas[i]._id, s: objStatus[maquinas[i].status] || '--' });
  			}
  			res.json(arr);
  		},objStatus);
  	});
};

exports.statusMaquinaUpdateAll = (req, res) => {
	modelStatus.getAll(function(status, err) {
		var arrStatus = [];
		for (var i = 0; i < status.length; i++) {
			arrStatus.push(status[i].codigo);
		}

  		modelMaquina.getAll(function(maquinas, err, arrStatus) {
  			var arr = [];
  			for (var i = 0; i < maquinas.length; i++) {
  				maquinas[i].status = arrStatus[Math.floor(Math.random()*arrStatus.length)];
  				maquinas[i].save()
  			}
  			res.json({status:'ok'});
  		},arrStatus);
  	});
};

exports.maqStaUpdOne = (req, res) => {
	modelStatus.getByCod(req.params.sta,function(status, err) {
		if(status){
	  		modelMaquina.getByCod(req.params.maq,function(maquina, err) {
	  			if(maquina){
	  				maquina.status = status.codigo;
	  				maquina.save(function(err,nObj) {
	  					res.json({status:'ok', desc:"Status alterado"});
	  				})

	  			} else {
	  				res.json({status:'err', desc: "Código da Maquina não encontrado", err: "002"});
	  			}
	  		});
	  	} else {
	  		res.json({status:'err', desc: "Código do Status não encontrado", err: "001"});
	  	}
  	});
};

exports.maqGetLastUpd = (req, res) => {
	modelStatus.getAll(function(status, err) {
		var arrStatus = [];
		for (var i = 0; i < status.length; i++) {
			arrStatus.push(status[i].codigo);
		}

		modelMaquina.getLast(function(maquina, err) {
			if(maquina){
				res.json({ m:maquina.codigo, s: arrStatus });
			} else {
				res.json({status:'err', desc: "Maquina não encontrada", err: "002"});
			}
		});
	})

};




