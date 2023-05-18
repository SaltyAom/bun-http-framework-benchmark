"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const config_1 = require("@adonisjs/core/build/config");
exports.default = (0, config_1.hashConfig)({
    default: Env_1.default.get('HASH_DRIVER', 'scrypt'),
    list: {
        scrypt: {
            driver: 'scrypt',
            cost: 16384,
            blockSize: 8,
            parallelization: 1,
            saltSize: 16,
            keyLength: 64,
            maxMemory: 32 * 1024 * 1024,
        },
        argon: {
            driver: 'argon2',
            variant: 'id',
            iterations: 3,
            memory: 4096,
            parallelism: 1,
            saltSize: 16,
        },
        bcrypt: {
            driver: 'bcrypt',
            rounds: 10,
        },
    },
});
//# sourceMappingURL=hash.js.map