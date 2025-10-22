import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Return user ID from request
    // In production, this should be populated by an auth middleware/guard
    return request.user?.id || request.headers['x-user-id'];
  },
);
