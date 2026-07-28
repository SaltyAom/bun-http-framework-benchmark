"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
const node_fs_1 = require("node:fs");
const { extraRoutes } = require('../../../extra-routes.mjs');
for (const route of extraRoutes) {
    Route_1.default.get(route, () => 'ok');
    Route_1.default.post(`${route}/submit`, () => 'ok');
}
Route_1.default.get('/', () => 'Hi');
Route_1.default.get('/video', ({ response }) => {
    response.header('content-type', 'video/mp4');
    response.stream((0, node_fs_1.createReadStream)('public/kyuukurarin.mp4'));
});
Route_1.default.get('/id/:id', ({ params, request, response }) => {
    response.header('x-powered-by', 'benchmark');
    return `${params.id} ${request.qs().name}`;
});
Route_1.default.post('/json', ({ request }) => request.body());
//# sourceMappingURL=routes.js.map
