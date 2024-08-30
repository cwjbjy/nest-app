import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  getList() {
    return [
      {
        name: '12',
        id: 1,
      },
      {
        name: '1233',
        id: 2,
      },
    ];
  }
}
