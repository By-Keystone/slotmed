import { Plan, SubscriptionStatus } from "@prisma/client";
import { Subscription } from "../entities/subscription/entity";

export interface CreateSubscriptionDto {
    accountId: string;
    status: SubscriptionStatus;
    plan: Plan
}

export interface ISubscriptionRepository { 
    save(dto: CreateSubscriptionDto): Promise<Subscription>
}