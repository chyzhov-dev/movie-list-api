import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { AuthService } from '@modules/auth/services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
