module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert(
        "roles",
        [
          {
            name: "SUPER ADMIN",
            isActive: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "HR",
            isActive: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "EMPLOYEE",
            isActive: "1",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete("employees", null, {});
    },
  };
  