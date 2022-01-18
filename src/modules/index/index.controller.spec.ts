import { Test, TestingModule } from '@nestjs/testing';
import { IndexController } from './index.controller.js';

describe('IndexController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [IndexController,],
      providers: [],
    }).compile();
  });

  // describe('getHello', () => {
  //   it('should return "Hello World!"', () => {
  //     const indexController = app.get<IndexController>(IndexController);
  //     expect(IndexController.getHello()).toBe('Hello World!');
  //   });
  // });
});
