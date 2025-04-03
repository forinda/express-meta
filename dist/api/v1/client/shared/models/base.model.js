"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseEntity = void 0;
class baseEntity {
    constructor(data) {
        this.id = data.id || crypto.randomUUID();
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || this.created_at;
    }
    toJSON() {
        return {
            id: this.id,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}
exports.baseEntity = baseEntity;
