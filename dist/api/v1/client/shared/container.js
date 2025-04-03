"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const config_1 = require("./db/config");
// Register the database instance
tsyringe_1.container.register('Database', { useValue: config_1.db });
// Register repositories
const user_repository_1 = require("../users/repositories/user.repository");
tsyringe_1.container.register('UserRepository', { useClass: user_repository_1.UserRepository });
// Register services
const user_service_1 = require("../users/services/user.service");
tsyringe_1.container.register('UserService', { useClass: user_service_1.UserService });
