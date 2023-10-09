type ThrottleOptions = {
    delay: number;
    leading?: boolean;
    onError?: (error: Error | unknown) => void;
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

    function throttled(this, ...args: any[]): T {
      if (!options.leading) {
        if (!timeLeft) {
          timeLeft = setTimeout(() => {
              invoke(this, ...lastArgs); //Shadi hint : invoke with the last agument saved
              timeLeft = null;
          }, options.delay);
        } else {
          lastArgs = args;
        }
      } else {
        if (!wait) {
          wait = true;
          superHandler.invoke(this, ...args);
          timeLeft = setTimeout(() => {
            wait = false;
          }, options.delay);
        }
      }
      return result;
    }

    function invoke(scope, ...args: any[]): T {
      try {
        result = handler.apply(scope, args);
      } catch (err) {
        if(options.onError)
        options.onError(err)
        else{
          throw err;
        }
      }
      return result;
    }
  
    function cancel(): void {
      wait = true;
      if (timeLeft) {
        clearTimeout(timeLeft);
      }
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