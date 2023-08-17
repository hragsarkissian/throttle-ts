type ThrottleOptions = {
    delay: number;
    leading?: boolean;
  };
  
  type ThrottledHandler<T> = {
    (...args: any[]): T;
    invoke: (...args: any[]) => T;
    cancel: () => void;
  };
  
  export function throttle<T>(
    handler: (...args: any[]) => T,
    options: ThrottleOptions
  ): ThrottledHandler<T> {
    let timeLeft: NodeJS.Timeout | null = null;
    let result: T;
    let wait = false;
  
    function invoke(...args: any[]): T {
      try {
        result = handler.apply(this, args);
      } catch (err) {
        onError(err);
      }
      return result;
    }
  
    function cancel(): void {
      wait = true;
      if (timeLeft) {
        clearTimeout(timeLeft);
      }
    }
  
    function onError(error: Error): Error {
      return error;
    }
  
    function throttled(...args: any[]): T {
      if (!options.leading) {
        wait = true;
  
        if (timeLeft !== null) {
          superHandler.cancel();
        }
  
        timeLeft = setTimeout(() => {
          superHandler.invoke(...args);
          wait = false;
        }, options.delay);
      } else {
        if (!wait) {
          superHandler.invoke(...args);
        }
        wait = true;
  
        timeLeft = setTimeout(() => {
          wait = false;
        }, options.delay);
      }
      return result;
    }
  
    const superHandler: ThrottledHandler<T> = Object.assign(throttled, {
      invoke,
      cancel,
    });
  
    return superHandler;
  }
  
  // Example usage
  const calculate = (num: number): number => num;
  const throttled = throttle<number>(calculate, { delay: 30 });
  // Usage
  throttled(1);
  throttled(2);
  throttled(3);
  throttled(4);