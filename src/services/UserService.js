const ApiError = require("../utils/ApiError");
const userRepository = require("../repositories/UserRepository");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");

class UserService {
  async createUser(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw ApiError.conflict("A user with this email already exists.");

    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || "cashier",
      phone: data.phone,
    });

    return this._sanitize(user);
  }

  async getUsers(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};

    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: new RegExp(query.search, "i") },
        { email: new RegExp(query.search, "i") },
      ];
    }

    const [users, total] = await Promise.all([
      userRepository.findMany(filter, { skip, limit }),
      userRepository.count(filter),
    ]);

    return {
      data: users.map((u) => this._sanitize(u)),
      pagination: buildPaginationMeta(total, page, limit),
    };
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User not found.");
    return this._sanitize(user);
  }

  async updateUser(id, data, requestingUser) {
    const disallowed = ["password"];
    disallowed.forEach((f) => delete data[f]);

    if (String(requestingUser.id || requestingUser._id) === String(id) && data.role) {
      throw ApiError.forbidden("You cannot change your own role.");
    }

    const user = await userRepository.updateById(id, data);
    if (!user) throw ApiError.notFound("User not found.");
    return this._sanitize(user);
  }

  async updateStatus(id, status) {
    if (!["active", "inactive"].includes(status)) {
      throw ApiError.badRequest("Status must be either active or inactive.");
    }
    const user = await userRepository.updateById(id, { status });
    if (!user) throw ApiError.notFound("User not found.");
    return this._sanitize(user);
  }

  async deleteUser(id, requestingUser) {
    if (String(requestingUser.id || requestingUser._id) === String(id)) {
      throw ApiError.forbidden("You cannot delete your own account.");
    }
    const user = await userRepository.deleteById(id);
    if (!user) throw ApiError.notFound("User not found.");
    return { id };
  }

  _sanitize(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
    };
  }
}

module.exports = new UserService();
