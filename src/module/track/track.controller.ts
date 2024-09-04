import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { PlainBody } from 'src/core/decorators/plain-body.decorator';

import { TrackDto, TrackOldDto } from './dto';
import { TrackService } from './track.service';
@ApiTags('埋点')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: '新埋点' })
  @ApiBody({
    type: TrackDto,
    required: true,
  })
  @Post()
  async track(@PlainBody() params: TrackDto[]) {
    return this.trackService.track(params);
  }

  @ApiOperation({ summary: '旧埋点' })
  @ApiBody({
    type: TrackOldDto,
    required: true,
  })
  @Post('/web')
  async trackweb(@PlainBody() params: TrackOldDto) {
    return this.trackService.trackweb(params);
  }
}
