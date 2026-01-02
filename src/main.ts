import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS
    // app.enableCors({
    //     origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    //     credentials: true,
    // });

    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigin = configService.get('CORS_ORIGIN');

            if (!origin) return callback(null, true); // allow server-to-server
            if (allowedOrigin === '*') return callback(null, true);
            if (allowedOrigin?.split(',').includes(origin)) {
                return callback(null, true);
            }

            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    });


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
