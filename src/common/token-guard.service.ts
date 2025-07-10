import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = process.env.MY_TOKEN;
    if (request.url.startsWith(`/${token}`)) {
      request.url = request.url.replace(`/${token}`, '');
      return true;
    }
    return false;
  }
}
