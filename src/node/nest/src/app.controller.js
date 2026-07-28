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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const app_service_1 = require("./app.service");
const { extraRoutes } = require('../../../extra-routes.mjs');
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    getVideo() {
        return new common_1.StreamableFile((0, node_fs_1.createReadStream)('public/kyuukurarin.mp4'), {
            type: 'video/mp4'
        });
    }
    getCompose(id, name) {
        return `${id} ${name}`;
    }
    postMirror(body) {
        return body;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.Header)('content-type', 'text/plain'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/video'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getVideo", null);
__decorate([
    (0, common_1.Get)('/id/:id'),
    (0, common_1.Header)('content-type', 'text/plain'),
    (0, common_1.Header)('x-powered-by', 'benchmark'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getCompose", null);
__decorate([
    (0, common_1.Post)('/json'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "postMirror", null);
for (const [index, route] of extraRoutes.entries()) {
    for (const [method, path, prefix] of [
        [common_1.Get, route, 'extraGet'],
        [common_1.Post, `${route}/submit`, 'extraPost']
    ]) {
        const name = `${prefix}${index}`;
        Object.defineProperty(AppController.prototype, name, {
            configurable: true,
            value: () => 'ok'
        });
        method(path)(AppController.prototype, name, Object.getOwnPropertyDescriptor(AppController.prototype, name));
    }
}
for (const name of ['getHello', 'getVideo', 'getCompose', 'postMirror']) {
    const descriptor = Object.getOwnPropertyDescriptor(AppController.prototype, name);
    Reflect.deleteProperty(AppController.prototype, name);
    Object.defineProperty(AppController.prototype, name, descriptor);
}
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map
