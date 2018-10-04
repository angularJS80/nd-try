// [ CONFIGURE Sequelize ]
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./../config/mysql')[env];
const fs = require("fs"); // 파일시스템 접근을 위한 모듈 호출
const path = require('path');
var sqlModelsDir = path.join(__dirname, "../")+'sqlModels/'
exports.mysqlSequelize = function() {
    let sequelize;
    let _db={};
    if (config.use_env_variable) {
        sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
        sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
    console.log("#####################");
    fs.readdirSync(sqlModelsDir)
      .forEach(file => {
          console.log(file);
            const model = sequelize['import'](path.join(sqlModelsDir, file));

          _db[model.name] = model;
      });

    Object.keys(_db).forEach(modelName => {
        console.log(_db[modelName].associate);
        if (_db[modelName].associate) {
            _db[modelName].associate(_db);
        }
    });

    _db.sequelize = sequelize;
    _db.Sequelize = Sequelize;
    sequelize.sync();
    console.log("connected to mysql Server;")
  return _db;
}