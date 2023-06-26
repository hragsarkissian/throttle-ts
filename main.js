function throttle(handler, options = {}) {
    let timeLeft = null;
    let leading = false;
    let lastExecTime = null;
    let result;
    let error;
  
    //set the 3 main arguments to options
    const { delay = 0, leadingCall = false, onError } = options;
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
      leading = false;
      previousCallTime = 0;
      result = undefined;
      error = undefined;
    }
  
    //throttled function is used to moderate the invocation of the handler
    function throttled(...args) {
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastExecTime;
    
      if (leading) {
        // If leading is enabled and there is no pending execution,
        // execute the function immediately
        invoke.apply(this, args);
        lastExecTime = currentTime;
      }

        else if (!timeLeft && elapsedTime >= delay) {
          result = invoke.apply(this, args);
          lastExecTime = currentTime;
        }
        else if (!timeLeft) {
        timeLeft = setTimeout(() => {
            console.log("hello");
            result = invoke.apply(this, args);
            lastExecTime = Date.now();
            clearTimeout(timeLeft);
        }, delay - elapsedTime);
        }
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
  superHandler("Message 1",{leading: true}); // Leading edge invocation
  superHandler("Message 2"); // Skipped due to throttling delay
  superHandler.invoke("Message 3"); // Immediate invocation

  superHandler.cancel(); // Cancel the current delay