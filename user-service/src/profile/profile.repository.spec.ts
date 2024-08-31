import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepo } from './profile.repository';

describe('Profile', () => {
  let provider: ProfileRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileRepo],
    }).compile();

    provider = module.get<ProfileRepo>(ProfileRepo);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
