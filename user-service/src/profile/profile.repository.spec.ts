import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from './profile.repository';

describe('Profile', () => {
  let provider: Profile;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Profile],
    }).compile();

    provider = module.get<Profile>(Profile);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
