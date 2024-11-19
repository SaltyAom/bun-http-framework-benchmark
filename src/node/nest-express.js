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

// src/nest-express.ts
import { NestFactory } from "@nestjs/core";

// src/app.module.ts
import { Body, Controller, Get, Module, Param, Post, Query, Res } from "@nestjs/common";
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
  Get("/"),
  __legacyDecorateParamTS(0, Res()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AppController.prototype, "getHello", null);
__legacyDecorateClassTS([
  Get("/id/:id"),
  __legacyDecorateParamTS(0, Res()),
  __legacyDecorateParamTS(1, Param("id")),
  __legacyDecorateParamTS(2, Query("name")),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object,
    String,
    String
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AppController.prototype, "getCompose", null);
__legacyDecorateClassTS([
  Post("/json"),
  __legacyDecorateParamTS(0, Body()),
  __legacyMetadataTS("design:type", Function),
  __legacyMetadataTS("design:paramtypes", [
    Object
  ]),
  __legacyMetadataTS("design:returntype", undefined)
], AppController.prototype, "postMirror", null);
AppController = __legacyDecorateClassTS([
  Controller()
], AppController);

class AppModule {
}
AppModule = __legacyDecorateClassTS([
  Module({ controllers: [AppController] })
], AppModule);

// src/nest-express.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
