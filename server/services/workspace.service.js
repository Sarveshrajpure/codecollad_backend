const { Workspace } = require("../models/workspace");
const ApiError = require("../middlewares/apiError");
const httpStatus = require("http-status");

const createWorkspace = async (name, userId) => {
  try {
    const worksapceCreated = new Workspace({ name, userId });
    await worksapceCreated.save();
    return worksapceCreated;
  } catch (error) {
    throw error;
  }
};

const checkWorkspaceName = async (name) => {
  try {
    let checkName = await Workspace.find({ name });

    if (checkName[0]) {
      return checkName[0].name;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
const deleteWorkspace = async (workspaceId) => {
  try {
    let deleteWorkspace = await Workspace.deleteOne({ workspaceId });

    return deleteWorkspace.deletedCount;
  } catch (error) {
    throw error;
  }
};
module.exports = { createWorkspace, checkWorkspaceName, deleteWorkspace };