"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const base_model_1 = require("../../shared/models/base.model");
class user extends base_model_1.baseEntity {
    constructor(data) {
        super(data);
        this.name = data.name || '';
        this.email = data.email || '';
        this.age = data.age;
        this.last_login_at = data.last_login_at;
        this.updated_at = data.updated_at || new Date().toISOString();
    }
    toJSON() {
        return {
            ...super.toJSON(),
            name: this.name,
            email: this.email,
            age: this.age,
            last_login_at: this.last_login_at,
            updated_at: this.updated_at
        };
    }
    update(data) {
        if (data.name)
            this.name = data.name;
        if (data.email)
            this.email = data.email;
        if (data.age !== undefined)
            this.age = data.age;
        if (data.last_login_at)
            this.last_login_at = data.last_login_at;
        this.updated_at = new Date().toISOString();
    }
}
exports.user = user;
