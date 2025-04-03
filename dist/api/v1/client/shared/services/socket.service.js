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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const singleton_decorator_1 = require("../../../../../decorators/singleton.decorator");
const logger_service_1 = require("./logger.service");
const config_service_1 = require("./config.service");
let SocketService = class SocketService {
    constructor(logger, configService) {
        this.logger = logger;
        this.configService = configService;
        this.io = null;
    }
    /**
     * Initialize Socket.IO server
     * @param httpServer HTTP server instance
     */
    initialize(httpServer) {
        // Create Socket.IO server
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: this.configService.getServerConfig().cors.origin,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        this.setupEventHandlers();
    }
    /**
     * Setup Socket.IO event handlers
     */
    setupEventHandlers() {
        if (!this.io) {
            throw new Error('Socket.IO server not initialized');
        }
        this.io.on('connection', (socket) => {
            this.handleConnection(socket);
        });
        // Handle server-wide events
        this.io.on('error', (error) => {
            this.logger.error('Socket.IO server error:', error);
        });
    }
    /**
     * Handle new socket connections
     * @param socket Socket instance
     */
    handleConnection(socket) {
        this.logger.info('New Socket.IO connection established', {
            id: socket.id,
            handshake: {
                address: socket.handshake.address,
                headers: socket.handshake.headers
            }
        });
        // Handle custom events
        socket.on('message', (data) => {
            this.handleMessage(socket, data);
        });
        socket.on('disconnect', (reason) => {
            this.handleDisconnect(socket, reason);
        });
        // Handle errors
        socket.on('error', (error) => {
            this.handleError(socket, error);
        });
    }
    /**
     * Handle incoming messages
     * @param socket Socket instance
     * @param data Message data
     */
    handleMessage(socket, data) {
        this.logger.debug('Received Socket.IO message:', { socketId: socket.id, data });
        // Broadcast the message to all connected clients except the sender
        socket.broadcast.emit('message', {
            from: socket.id,
            data
        });
    }
    /**
     * Handle socket disconnection
     * @param socket Socket instance
     * @param reason Disconnection reason
     */
    handleDisconnect(socket, reason) {
        this.logger.info('Socket.IO connection closed', {
            socketId: socket.id,
            reason
        });
    }
    /**
     * Handle socket errors
     * @param socket Socket instance
     * @param error Error object
     */
    handleError(socket, error) {
        this.logger.error('Socket.IO error:', {
            socketId: socket.id,
            error
        });
    }
    /**
     * Close Socket.IO server
     */
    async close() {
        if (!this.io) {
            return;
        }
        return new Promise((resolve) => {
            this.io.close(() => {
                this.logger.info('Socket.IO server stopped');
                resolve();
            });
        });
    }
    /**
     * Get the Socket.IO server instance
     */
    getIO() {
        return this.io;
    }
    /**
     * Emit an event to all connected clients
     * @param event Event name
     * @param data Event data
     */
    emit(event, data) {
        if (!this.io) {
            throw new Error('Socket.IO server not initialized');
        }
        this.io.emit(event, data);
    }
    /**
     * Emit an event to a specific room
     * @param room Room name
     * @param event Event name
     * @param data Event data
     */
    emitToRoom(room, event, data) {
        if (!this.io) {
            throw new Error('Socket.IO server not initialized');
        }
        this.io.to(room).emit(event, data);
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = __decorate([
    (0, singleton_decorator_1.Singleton)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        config_service_1.ConfigService])
], SocketService);
