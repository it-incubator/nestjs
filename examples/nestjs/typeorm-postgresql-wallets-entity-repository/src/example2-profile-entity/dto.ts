import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// create-profile.dto.ts
export class InputProfileDto {
  @ApiProperty({ description: 'ID of the user associated with this profile', example: 1 })
  userId?: number | null;

  @ApiPropertyOptional({ description: 'Hobby of the user', example: 'Photography' })
  hobby?: string;

  @ApiPropertyOptional({ description: 'Education background of the user', example: 'Bachelor of Science' })
  education?: string;
}