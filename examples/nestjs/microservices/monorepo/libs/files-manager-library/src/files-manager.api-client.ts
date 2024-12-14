import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FileOutputDTO } from './dto';

@Injectable()
export class FilesManagerApiClient {
  constructor(private httpService: HttpService) {}
  async getFiles(): Promise<FileOutputDTO[]> {
    const response = await lastValueFrom(
      this.httpService.get<FileOutputDTO[]>('http://localhost:3001/files'),
    );
    const data = response.data;
    return data;
  }
}
