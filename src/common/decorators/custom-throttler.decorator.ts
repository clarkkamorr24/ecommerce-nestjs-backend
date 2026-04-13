// custom throttler decorator
import { Throttle } from '@nestjs/throttler';
import { applyDecorators } from '@nestjs/common';

export const StrictThrottle = () => {
  return applyDecorators(
    Throttle({
      default: {
        ttl: 1000,
        limit: 3,
      },
    }),
  );
};

// moderate rate for orders
export const ModerateThrottle = () => {
  return applyDecorators(
    Throttle({
      default: {
        ttl: 1000,
        limit: 5,
      },
    }),
  );
};

//relaxed rate for read operations
export const RelaxedThrottle = () => {
  return applyDecorators(
    Throttle({
      default: {
        ttl: 1000,
        limit: 20,
      },
    }),
  );
};
