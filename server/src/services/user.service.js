const userRepository = require("../repositories/user.repository");
const ApiError = require("../utils/ApiError");

const getAllUsers = async (query) => {
    return await userRepository.getAll(query);
};

const getUserById = async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const updateUser = async (id, data) => {
    const user = await userRepository.updateById(id, data);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const deleteUser = async (id) => {

    const user = await userRepository.softDelete(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

const getUserStats = async () => {
    return await userRepository.getStats();
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,
};