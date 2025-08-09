import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { CreateQueueItemDto } from './dto/create-queue-item.dto';
import { UpdateQueueItemDto } from './dto/update-queue-item.dto';
import { QueueStatus, Priority } from './entities/queue-item.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Queue')
@Controller('queue')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  @ApiOperation({ summary: 'Add patient to queue' })
  @ApiResponse({ status: 201, description: 'Patient added to queue successfully' })
  create(@Body() createQueueItemDto: CreateQueueItemDto) {
    return this.queueService.create(createQueueItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get queue items' })
  @ApiQuery({ name: 'doctorId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: QueueStatus })
  @ApiResponse({ status: 200, description: 'Queue items retrieved successfully' })
  findAll(@Query('doctorId') doctorId?: string, @Query('status') status?: QueueStatus) {
    if (doctorId) {
      return this.queueService.findByDoctor(doctorId);
    }
    if (status) {
      return this.queueService.findByStatus(status);
    }
    return this.queueService.findAll();
  }

  @Get('waiting')
  @ApiOperation({ summary: 'Get waiting queue' })
  @ApiResponse({ status: 200, description: 'Waiting queue retrieved successfully' })
  getWaitingQueue() {
    return this.queueService.findWaitingQueue();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get queue statistics' })
  @ApiQuery({ name: 'doctorId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Queue statistics retrieved successfully' })
  getStats(@Query('doctorId') doctorId?: string) {
    return this.queueService.getQueueStats(doctorId);
  }

  @Post('call-next/:doctorId')
  @ApiOperation({ summary: 'Call next patient in queue' })
  @ApiResponse({ status: 200, description: 'Next patient called successfully' })
  @ApiResponse({ status: 404, description: 'No patients waiting' })
  callNext(@Param('doctorId') doctorId: string) {
    return this.queueService.callNext(doctorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get queue item by ID' })
  @ApiResponse({ status: 200, description: 'Queue item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Queue item not found' })
  findOne(@Param('id') id: string) {
    return this.queueService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update queue item' })
  @ApiResponse({ status: 200, description: 'Queue item updated successfully' })
  @ApiResponse({ status: 404, description: 'Queue item not found' })
  update(@Param('id') id: string, @Body() updateQueueItemDto: UpdateQueueItemDto) {
    return this.queueService.update(id, updateQueueItemDto);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start queue item (set to in progress)' })
  @ApiResponse({ status: 200, description: 'Queue item started successfully' })
  start(@Param('id') id: string) {
    return this.queueService.startItem(id);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark queue item as completed' })
  @ApiResponse({ status: 200, description: 'Queue item completed successfully' })
  complete(@Param('id') id: string) {
    return this.queueService.completeItem(id);
  }

  @Patch(':id/skip')
  @ApiOperation({ summary: 'Skip queue item' })
  @ApiResponse({ status: 200, description: 'Queue item skipped successfully' })
  skip(@Param('id') id: string) {
    return this.queueService.skipItem(id);
  }

  @Patch(':id/priority')
  @ApiOperation({ summary: 'Update queue item priority' })
  @ApiResponse({ status: 200, description: 'Priority updated successfully' })
  updatePriority(@Param('id') id: string, @Body('priority') priority: Priority) {
    return this.queueService.updatePriority(id, priority);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from queue' })
  @ApiResponse({ status: 200, description: 'Queue item removed successfully' })
  @ApiResponse({ status: 404, description: 'Queue item not found' })
  remove(@Param('id') id: string) {
    return this.queueService.remove(id);
  }
}
