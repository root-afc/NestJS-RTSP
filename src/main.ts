import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Stream = require('node-rtsp-stream');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    await app.listen(3000);    
    const stream = new Stream({
        streamUrl: 'rtsp://admin:admin@1.1.1.1:554/cam/realmonitor?channel=1&subtype=0',
        wsPort: 9999
    })
}
bootstrap();
