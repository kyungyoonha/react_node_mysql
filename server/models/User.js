module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                validate: {
                    len: [0, 50],
                },
                allowNull: false,
            },

            password: {
                type: DataTypes.STRING,
                validate: {
                    len: [3, 100],
                },
                allowNull: false,
            },

            displayname: { type: DataTypes.STRING },
        },
        {
            tableName: "User",
        }
    );

    return User;
};
