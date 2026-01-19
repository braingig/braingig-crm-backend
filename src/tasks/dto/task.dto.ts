import { InputType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsNumber } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

registerEnumType(TaskStatus, { name: 'TaskStatus' });
registerEnumType(TaskPriority, { name: 'TaskPriority' });

@InputType()
export class CreateTaskInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    projectId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    title: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => TaskPriority)
    @IsEnum(TaskPriority)
    priority: TaskPriority;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    assignedToId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    dueDate?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    estimatedTime?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    parentTaskId?: string;
}

@InputType()
export class UpdateTaskInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    title?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => TaskStatus, { nullable: true })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @Field(() => TaskPriority, { nullable: true })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    assignedToId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsDate()
    dueDate?: Date;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    timeSpent?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    estimatedTime?: number;
}

@InputType()
export class TaskFiltersInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    projectId?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    assignedToId?: string;

    @Field(() => TaskStatus, { nullable: true })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @Field(() => TaskPriority, { nullable: true })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;
}

@ObjectType()
export class TaskType {
    @Field()
    id: string;

    @Field()
    projectId: string;

    @Field()
    title: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => TaskStatus)
    status: TaskStatus;

    @Field(() => TaskPriority)
    priority: TaskPriority;

    @Field({ nullable: true })
    assignedToId?: string;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    dueDate?: Date;

    @Field()
    timeSpent: number;

    @Field({ nullable: true })
    estimatedTime?: number;

    @Field({ nullable: true })
    parentTaskId?: string;

    @Field(() => [TaskType], { nullable: true })
    subTasks?: TaskType[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

@ObjectType()
export class CommentType {
    @Field()
    id: string;

    @Field()
    taskId: string;

    @Field()
    content: string;

    @Field()
    createdAt: Date;
}
