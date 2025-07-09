const taskData = (Task) => {
  const create = async (obj) => {
    try {
      const result = await Task.create(obj);
      return { _id: result._id, message: "Task created" };
    } catch (err) {
      throw err;
    }
  };
  const findAll = async () => {
    try {
      const tasks = await Task.findAll();
      return tasks;
    } catch (err) {
      throw err;
    }
  };

  const findOne = async (conditionObj, selectField) => {
    try {
      const task = await Task.findOne(conditionObj).select(selectField);
      return task;
    } catch (err) {
      throw err;
    }
  };
  const updateOne = async (conditionObj, updateObj) => {
    try {
      const result = await Task.updateOne(conditionObj, updateObj);
      return result;
    } catch (err) {
      throw err;
    }
  };
  const findOneAndUpdate = async (conditionObj, updateObj) => {
    try {
      const result = await Task.findOneAndUpdate(conditionObj, updateObj);
      return result;
    } catch (err) {
      throw err;
    }
  };
  const deleteOne = async (obj) => {
    try {
      const result = await Task.deleteOne(obj);
      return result;
    } catch (err) {
      throw err;
    }
  };
  const deleteMany = async (obj) => {
    try {
      const result = await Task.deleteMany(obj);
      return result;
    } catch (err) {
      throw err;
    }
  };
  return {
    findOne,
    updateOne,
    create,
    findOneAndUpdate,
    deleteOne,
    deleteMany,
    findAll,
  };
};
module.exports = taskData;
