"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
// Create and configure the container
const container = new inversify_1.Container();
exports.container = container;
