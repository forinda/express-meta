"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressRequestContext = void 0;
class ExpressRequestContext {
    constructor(request, response, params = {}, query = {}, body = {}, user, pagination) {
        this.request = request;
        this.response = response;
        this.params = params;
        this.query = query;
        this.body = body;
        this.user = user;
        this.pagination = pagination;
    }
}
exports.ExpressRequestContext = ExpressRequestContext;
