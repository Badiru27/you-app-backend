import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProfileRepo } from './profile.repository';
import { Profile, UpdateProfile } from 'src/types/profile';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepo: ProfileRepo) {}

  async create(
    data: UpdateProfile,
  ): Promise<Profile & { zodiac: string; horoscope: string }> {
    const exitingProfile = await this.profileRepo.find(data.userId);

    if (exitingProfile)
      throw new ForbiddenException('Profile Already Registered');

    const profile = await this.profileRepo.create(data);
    const zodiac = profile.birthday
      ? this.getZodiacSign(profile.birthday)
      : null;
    return {
      ...profile,
      zodiac,
      horoscope: profile.birthday ? this.getHoroscopeAnimal(zodiac) : null,
    };
  }

  async find(
    userId: string,
  ): Promise<(Profile & { zodiac: string; horoscope: string }) | null> {
    const profile = await this.profileRepo.find(userId);

    if (!profile) throw new NotFoundException('Profile not found');
    delete profile.user.password;
    const zodiac = profile.birthday
      ? this.getZodiacSign(profile.birthday)
      : null;
    return {
      ...profile,
      zodiac,
      horoscope: profile.birthday ? this.getHoroscopeAnimal(zodiac) : null,
    };
  }

  async update(
    data: UpdateProfile,
  ): Promise<Profile & { zodiac: string; horoscope: string }> {
    const { userId, ...rest } = data;
    const exitingProfile = await this.profileRepo.find(userId);

    if (!exitingProfile) throw new NotFoundException('Profile not found');

    const profile = await this.profileRepo.update(exitingProfile.id, rest);
    const zodiac = profile.birthday
      ? this.getZodiacSign(profile.birthday)
      : null;
    return {
      ...profile,
      zodiac,
      horoscope: profile.birthday ? this.getHoroscopeAnimal(zodiac) : null,
    };
  }

  private getZodiacSign(birthDate: Date) {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDay();

    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
      return 'Aries';
    } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
      return 'Taurus';
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
      return 'Gemini';
    } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
      return 'Cancer';
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
      return 'Leo';
    } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
      return 'Virgo';
    } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
      return 'Libra';
    } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
      return 'Scorpio';
    } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
      return 'Sagittarius';
    } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
      return 'Capricorn';
    } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
      return 'Aquarius';
    } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
      return 'Pisces';
    }

    return 'Unknown';
  }

  // Method to return the animal associated with each zodiac sign
  private getHoroscopeAnimal(zodiacSign: string): string {
    switch (zodiacSign) {
      case 'Aries':
        return 'Ram';
      case 'Taurus':
        return 'Bull';
      case 'Gemini':
        return 'Monkey';
      case 'Cancer':
        return 'Crab';
      case 'Leo':
        return 'Lion';
      case 'Virgo':
        return 'Owl';
      case 'Libra':
        return 'Swan';
      case 'Scorpio':
        return 'Scorpion';
      case 'Sagittarius':
        return 'Horse';
      case 'Capricorn':
        return 'Goat';
      case 'Aquarius':
        return 'Dolphin';
      case 'Pisces':
        return 'Fish';
      default:
        return 'Unknown';
    }
  }
}
