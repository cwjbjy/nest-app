import { Controller, Post } from '@nestjs/common';
import { PlainBody } from 'src/core/decorators/plain-body.decorator';

import { TrackService } from './track.service';

@Controller()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('/track')
  async track(@PlainBody() params) {
    return this.trackService.track(params);
  }

  @Post('/trackweb')
  async trackweb(@PlainBody() params) {
    return this.trackService.trackweb(params);
  }
}
