/**
 * 유저 정보 Model
 */
module.exports = (sequelize, DataTypes) => {
    return user = sequelize.define('Users', {
        id: {
            type: DataTypes.BIGINT(11),
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING(10),
        password: DataTypes.STRING(20),
        nickname: DataTypes.STRING(30),
        email: DataTypes.STRING(30),
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        instagram: DataTypes.STRING(30),
        type: DataTypes.INTEGER,
        open: DataTypes.INTEGER,
        point: DataTypes.INTEGER,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        charset: 'utf8mb4',
        underscored: true
    });
};