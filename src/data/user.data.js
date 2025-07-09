const userData = (User) => {
  const create = async (userData) => {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const findOne = async (criteria) => {
    try {
      const user = await User.findOne({
        where: criteria,
      });
      return user;
    } catch (error) {
      throw error;
    }
  };

  const findAll = async () => {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  };

  const findById = async (id) => {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const update = async (id, updateData) => {
    try {
      const [updated] = await User.update(updateData, {
        where: { id: id },
      });
      if (updated) {
        const updatedUser = await User.findByPk(id);
        return updatedUser;
      }
      throw new Error("User not found");
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const deleted = await User.destroy({
        where: { id: id },
      });
      if (deleted) {
        return { message: "User deleted successfully" };
      }
      throw new Error("User not found");
    } catch (error) {
      throw error;
    }
  };

  return {
    create,
    findOne,
    findAll,
    findById,
    update,
    delete: deleteUser,
  };
};

module.exports = userData;
