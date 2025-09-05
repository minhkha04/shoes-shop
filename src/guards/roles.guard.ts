// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);
        if (!required || required.length === 0) return true;

        const req = ctx.switchToHttp().getRequest();
        const user = req.user as { role?: string };
        if (!user?.role) throw new ForbiddenException('No role');

        // chỉ cần 1 role khớp là qua
        const ok = required.some(r => r === user.role);
        if (!ok) throw new ForbiddenException('Permission denied');
        return true;
    }
}
