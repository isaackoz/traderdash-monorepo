import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform {
  constructor(
    private readonly minLength?: number,
    private readonly maxLength?: number,
  ) {}
  transform(value: any) {
    if (typeof value !== 'string') {
      throw new BadRequestException('Not a string');
    }
    if (this.minLength && value.length < this.minLength) {
      throw new BadRequestException('String too short');
    }
    if (this.maxLength && value.length > this.maxLength) {
      throw new BadRequestException('String too long');
    }
    return value;
  }
}
