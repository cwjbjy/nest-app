import { Controller, Post, Body } from '@nestjs/common';

import { TrackService } from './track.service';

@Controller()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post('/track')
  track(@Body() params) {
    return this.trackService.track(params);
  }

  @Post('/trackweb')
  trackweb(@Body() params) {
    return this.trackService.trackweb(params);
  }
}
