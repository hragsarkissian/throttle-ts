function throttle(handler, options = {}) {
    let timeLeft = null;
    let leadingCall = false;
    let previousCallTime = 0;
    let result;
    let error;
  
    //set the 3 main arguments to options
    const { delay = 0, leading = false, onError } = options;
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
      console.log("its cancelled")
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
  
  // Example usage
  const logHandler = (message) => console.log(message);
  
  const superHandler = throttle(logHandler, {
    delay: 200,
    leading: false,
    onError: (error) => console.error(error),
  });
  
  // Usage
  superHandler("Message 1"); // Leading edge invocation
  superHandler("Message 2"); // Skipped due to throttling delay
  superHandler.invoke("Message 3"); // Immediate invocation
  superHandler("Message 4"); // Immediate invocation

  superHandler.cancel(); // Cancel the current delay