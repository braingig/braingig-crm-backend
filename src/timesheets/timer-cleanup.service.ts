import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimerCleanupService {
    private readonly logger = new Logger(TimerCleanupService.name);

    constructor(private prisma: PrismaService) { }

    // Removed abandoned timer logic - not needed for current time tracking implementation

    // Run every hour to check for very long-running timers (more than 12 hours)
    @Cron('0 * * * *')
    async cleanupVeryLongTimers() {
        try {
            const activeEntries = await (this.prisma as any).timeEntry.findMany({
                where: {
                    endTime: null,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            const now = new Date();
            const longThreshold = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

            for (const entry of activeEntries) {
                const startTime = new Date(entry.startTime);
                const timeSinceStart = now.getTime() - startTime.getTime();

                // If timer has been running for more than 12 hours, stop it
                if (timeSinceStart > longThreshold) {
                    // Calculate actual working time using the same logic as stopTimeEntry
                    const rawDuration = Math.floor(timeSinceStart / (1000 * 60)); // Convert to minutes
                    
                    // Fetch activity events to calculate actual working time
                    const events = await (this.prisma as any).activityEvent.findMany({
                        where: {
                            employeeId: entry.employeeId,
                            createdAt: {
                                gte: entry.startTime,
                                lte: now
                            },
                            type: {
                                in: ['IDLE', 'ACTIVE']
                            }
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    });

                    // Calculate actual working time by summing ACTIVE periods
                    let actualWorkingMinutes = 0;
                    let lastActiveTime: Date | null = entry.startTime;
                    let wasActive = true; // Assume user starts as active

                    for (const event of events) {
                        if (event.type === 'IDLE' && wasActive) {
                            // User went from ACTIVE to IDLE - add the active period
                            const activeMinutes = (event.createdAt.getTime() - lastActiveTime!.getTime()) / (1000 * 60);
                            actualWorkingMinutes += Math.max(0, activeMinutes);
                            wasActive = false;
                        } else if (event.type === 'ACTIVE' && !wasActive) {
                            // User went from IDLE to ACTIVE - start new active period
                            lastActiveTime = event.createdAt;
                            wasActive = true;
                        }
                    }

                    // Add the final active period if user was active when timer stopped
                    if (wasActive && lastActiveTime) {
                        const finalActiveMinutes = (now.getTime() - lastActiveTime.getTime()) / (1000 * 60);
                        actualWorkingMinutes += Math.max(0, finalActiveMinutes);
                    }

                    // Use the calculated actual working time instead of raw duration
                    const duration = actualWorkingMinutes > 0 && actualWorkingMinutes < rawDuration 
                        ? Math.max(0, Math.floor(actualWorkingMinutes))
                        : rawDuration;

                    await (this.prisma as any).timeEntry.update({
                        where: { id: entry.id },
                        data: {
                            endTime: now,
                            duration,
                        },
                    });

                    // Update task time spent if task is associated
                    if (entry.taskId) {
                        await (this.prisma as any).task.update({
                            where: { id: entry.taskId },
                            data: {
                                timeSpent: {
                                    increment: duration,
                                },
                            },
                        });
                    }

                    this.logger.warn(
                        `Auto-stopped very long timer for employee ${entry.employee.name} (${entry.employee.email}). Duration: ${Math.floor(duration / 60)} hours ${duration % 60} minutes`
                    );
                }
            }
        } catch (error) {
            this.logger.error('Error during long timer cleanup:', error);
        }
    }
}