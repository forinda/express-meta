"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const tsyringe_1 = require("tsyringe");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const config_1 = require("../db/config");
let BaseRepository = class BaseRepository {
    constructor(database = config_1.db) {
        this.database = database;
    }
    async withTransaction(callback) {
        return await this.database.transaction(async (tx) => {
            return await callback(tx);
        });
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    __param(0, (0, tsyringe_1.inject)('Database')),
    __metadata("design:paramtypes", [postgres_js_1.PostgresJsDatabase])
], BaseRepository);
