import { PartialType } from '@nestjs/swagger';
import { CreateInternetDocumentDto } from './internet-document-create.dto';

export class UpdateNovumDto extends PartialType(CreateInternetDocumentDto) {}
