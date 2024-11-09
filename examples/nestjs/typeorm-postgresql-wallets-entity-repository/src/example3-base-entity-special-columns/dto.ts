import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// create-profile.dto.ts
export class InputWalletDto {
  @ApiPropertyOptional({ description: 'Title of the wallet', example: 'My Wallet' })
  title?: string;

  @ApiPropertyOptional({ description: 'Currency code', example: 'USD', maxLength: 3 })
  currency?: string;

  @ApiProperty({ description: 'Initial balance of the wallet', example: 100 })
  balance: number;

  @ApiProperty({ description: 'ID of the user who owns this wallet', example: '1' })
  ownerId: number;
}