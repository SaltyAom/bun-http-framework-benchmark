"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
require("reflect-metadata");
const source_map_support_1 = __importDefault(require("source-map-support"));
const standalone_1 = require("@adonisjs/core/build/standalone");
const runner_1 = require("@japa/runner");
source_map_support_1.default.install({ handleUncaughtExceptions: false });
const kernel = new standalone_1.Ignitor(__dirname).kernel('test');
kernel
    .boot()
    .then(() => Promise.resolve().then(() => __importStar(require('./tests/bootstrap'))))
    .then(({ runnerHooks, ...config }) => {
    const app = [() => kernel.start()];
    (0, runner_1.configure)({
        ...kernel.application.rcFile.tests,
        ...(0, runner_1.processCliArgs)(process.argv.slice(2)),
        ...config,
        ...{
            importer: (filePath) => Promise.resolve().then(() => __importStar(require(filePath))),
            setup: app.concat(runnerHooks.setup),
            teardown: runnerHooks.teardown,
        },
        cwd: kernel.application.appRoot,
    });
    (0, runner_1.run)();
});
//# sourceMappingURL=test.js.map