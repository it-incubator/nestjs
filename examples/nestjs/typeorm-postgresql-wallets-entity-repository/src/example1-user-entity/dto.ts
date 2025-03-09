import { ApiPropertyOptional } from '@nestjs/swagger';

// create-user.dto.ts
export class InputUserDto {
  @ApiPropertyOptional({ description: 'First name of the user', example: 'John' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name of the user', example: 'Doe' })
  lastName?: string;

  @ApiPropertyOptional({ description: 'Passport number of the user', example: '123456789' })
  passportNumber?: string;

  @ApiPropertyOptional({ description: 'Marital status of the user', example: true })
  isMarried?: boolean;

  @ApiPropertyOptional({ description: 'Work status', example: 'work, vacation' })
  status: 'work' | 'vacation';
}