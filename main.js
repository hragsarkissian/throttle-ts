const options = {
  delay: 1000,
  leading: true,
  onError: function (error) {
    // Error handler implementation
  }
};
export function throttle(handler, options) {
    let timeLeft = null;
    let leadingCall = false;
    let previousCallTime = 0;
    let result;
    let error;
    //set the 3 main arguments to options
    const { delay = 0, leading = false, onError } = options;
    console.log("delay",options);
      //...args parameter will capture the arguments "Message 1" and 
      // and pass them as an array to the underlying handler function
    function invoke(...args) {
      error = undefined;

      try {
        result = handler.apply(this, args);
      } catch (err) {
        error = err;
        if (onError) {
          onError(err);
        }
      }
      previousCallTime = Date.now();
      return result;
    }

    function cancel() {
      console.log("Skipped due to throttling delay")
      clearTimeout(timeLeft);
      timeLeft = null;
      leadingCall = false;
      previousCallTime = 0;
      result = undefined;
      error = undefined;
    }
  
    //throttled function is used to moderate the invocation of the handler
    function throttled(...args) {
      const now = Date.now();
  
      if (!leadingCall && (!timeLeft || now - previousCallTime >= delay)) {
        leadingCall = true;
        invoke.apply(this, args);
      }
  
      clearTimeout(timeLeft);
      timeoutId = setTimeout(() => {
        if (leading && leadingCall) {
          leadingCall = false;
          return;
        }
        invoke.apply(this, args);
      }, delay - (now - previousCallTime));
  
      return result;
    }
  
    //assigning superhandler to action methods
    const superHandler = Object.assign(throttled, {
      invoke,
      cancel,
    });

    return superHandler;
  }

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  
  // Example usage
  const calculate = (num) => num * 2;
  
  const superHandler = throttle(calculate, options);
  
  // Usage
  const output = superHandler(10); // Leading edge invocation
  console.log(output);
  wait(1000)
  const output1 = superHandler.invoke(20);
  console.log(output1); // 2
