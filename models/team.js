module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define('team', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });


    // Associate a team with employees
    Team.belongsToMany(sequelize.models.employee, { through: 'employee_team' });

    return Team;
};
  