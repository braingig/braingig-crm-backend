import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS
    const corsOrigin = configService.get('CORS_ORIGIN');
    
    // Parse the CORS_ORIGIN to handle multiple origins
    const allowedOrigins = corsOrigin === '*' 
        ? true 
        : corsOrigin?.split(',').map(origin => origin.trim()) || ['http://localhost:3000'];
    
    app.enableCors({
        origin: allowedOrigins,
        credentials: corsOrigin !== '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
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
