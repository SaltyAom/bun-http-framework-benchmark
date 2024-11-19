var __legacyDecorateClassTS = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1;i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __legacyDecorateParamTS = (index, decorator) => (target, key) => decorator(target, key, index);
var __legacyMetadataTS = (k, v) => {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};

// src/nest-fastify.ts
var import_core = require("@nestjs/core");
var import_platform_fastify = require("@nestjs/platform-fastify");

// src/app.module.ts
var import_common = require("@nestjs/common");
class AppController {
  getHello(res) {
    res.header("content-type", "text/plain").send("Hi");
  }
  getCompose(res, id, name) {
    res.header("content-type", "text/plain").send(`${id} ${name}`);
  }
  postMirror(body) {
    return body;
  }
}
__legacyDecorateClassTS([
  import_common.Get("/"),
  __legacyDecorateParamTS(0, import_common.Res()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AppController.prototype, "getHello", null);
__legacyDecorateClassTS([
  import_common.Get("/id/:id"),
  __legacyDecorateParamTS(0, import_common.Res()),
  __legacyDecorateParamTS(1, import_common.Param("id")),
  __legacyDecorateParamTS(2, import_common.Query("name")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object,
    String,
    String
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AppController.prototype, "getCompose", null);
__legacyDecorateClassTS([
  import_common.Post("/json"),
  __legacyDecorateParamTS(0, import_common.Body()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AppController.prototype, "postMirror", null);
AppController = __legacyDecorateClassTS([
  import_common.Controller()
], AppController);

class AppModule {
}
AppModule = __legacyDecorateClassTS([
  import_common.Module({ controllers: [AppController] })
], AppModule);

// src/nest-fastify.ts
async function bootstrap() {
  const app = await import_core.NestFactory.create(AppModule, new import_platform_fastify.FastifyAdapter);
  await app.listen(3000);
}
bootstrap();
