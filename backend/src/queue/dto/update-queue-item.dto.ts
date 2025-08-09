import { PartialType } from '@nestjs/swagger';
import { CreateQueueItemDto } from './create-queue-item.dto';

export class UpdateQueueItemDto extends PartialType(CreateQueueItemDto) {}
