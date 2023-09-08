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
    let lastArgs: any[]; //Shadi hint : save the argument

    function throttled(...args: any[]): T {
      if (!options.leading) {
        if (!timeLeft) {
          timeLeft = setTimeout(() => {
              invoke(...lastArgs); //Shadi hint : invoke with the last agument saved
              timeLeft = null;
          }, options.delay);
        } else {
          lastArgs = args;
        }
      } else {
        if (!wait) {
          wait = true;
          superHandler.invoke(...args);
          timeLeft = setTimeout(() => {
            wait = false;
          }, options.delay);
        }
      }
      return result;
    }

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