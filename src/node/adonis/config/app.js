"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = exports.profiler = exports.logger = exports.http = exports.appKey = void 0;
const proxy_addr_1 = __importDefault(require("proxy-addr"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.appKey = Env_1.default.get('APP_KEY');
exports.http = {
    allowMethodSpoofing: false,
    subdomainOffset: 2,
    generateRequestId: false,
    trustProxy: proxy_addr_1.default.compile('loopback'),
    etag: false,
    jsonpCallbackName: 'callback',
    cookie: {
        domain: '',
        path: '/',
        maxAge: '2h',
        httpOnly: true,
        secure: false,
        sameSite: false,
    },
};
exports.logger = {
    name: Env_1.default.get('APP_NAME'),
    enabled: true,
    level: Env_1.default.get('LOG_LEVEL', 'info'),
    prettyPrint: Env_1.default.get('NODE_ENV') === 'development',
};
exports.profiler = {
    enabled: true,
    blacklist: [],
    whitelist: [],
};
exports.validator = {};
//# sourceMappingURL=app.js.map