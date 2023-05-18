"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', () => 'hi');
Route_1.default.get('/id/:id', ({ params, request, response }) => {
    response.header('x-powered-by', 'benchmark');
    return `${params.id} ${request.qs().name}`;
});
Route_1.default.post('/json', ({ request }) => request.body());
//# sourceMappingURL=routes.js.map