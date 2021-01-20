

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('mst_user', {
   
    user_name: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    user_mob: {
      type: Sequelize.STRING(12),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    }
  });

  return User;
};
