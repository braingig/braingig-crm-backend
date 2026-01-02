import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS
    // app.enableCors({
    //     origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    //     credentials: true,
    // });
    app.use(
        cors({
            origin: true,        // reflect request origin
            credentials: true,   // allow cookies / auth headers
        }),
    );
    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global prefix
    app.setGlobalPrefix('api');

    const port = configService.get('PORT') || 4000;
    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📊 GraphQL Playground: http://localhost:${port}/api/graphql`);
}

bootstrap();
