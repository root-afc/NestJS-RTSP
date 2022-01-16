import { Injectable } from '@nestjs/common';
import { config } from 'aws-sdk';

@Injectable()
export class AwsService {
    configLoad(): void {
        const params = { region: 'us-east-2', accessKeyId: 'AKIAQ3J2BJQAJKD2SG5N', secretAccessKey: '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' };
        config.update(params);
  }
}
