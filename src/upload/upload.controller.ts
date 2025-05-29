import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';
import { Auth } from '@/auth/decorators/auth.decorator';
import { ResponsesSecurity } from '@/common/decorators/responses-security.decorator';
import { UserRoles } from '@/common/enums/user-roles.enum';
import { DeleteFilesDto } from './dto/delete-files.dto';

@Auth([UserRoles.ADMIN])
@ResponsesSecurity()
@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post()
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadService.uploadFiles(files);
  }

  @ApiOperation({ summary: 'Get multiple files' })
  @Get()
  @ApiQuery({ name: 'names', type: String, description: 'Comma-separated list of filenames' })
  async getFiles(@Query('names') names: string): Promise<string[]> {
    const fileNames = names.split(',').map((n) => n.trim());
    return this.uploadService.getFiles(fileNames);
  }

  @ApiOperation({ summary: 'Delete multiple files' })
  @Delete()
  async deleteFiles(@Body() body: DeleteFilesDto): Promise<{ message: string }> {
    await this.uploadService.deleteFiles(body.filenames);
    return { message: 'Files deleted successfully' };
  }
}
