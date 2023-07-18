const options = {
  delay: 1000,
  leading: false,
  onError: function (error) {
    // Error handler implementation
  }
};
function throttle(handler, options) {
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
      
      if (now - previousCallTime >= delay) {
        invoke.apply(this, args);
      }
      clearTimeout(timeLeft);
      timeLeft = setTimeout(() => {
        invoke.apply(this, args);
      }, delay - (now - previousCallTime));

      console.log("result3", result)
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
  
  const superHandler = throttle(calculate, { delay: 100});
  
  // Usage
  let output;
 output = superHandler(1); 
 output = superHandler(2);
 output = superHandler(3);
 output = superHandler(4);
 output = superHandler(5);
 output = superHandler(6);

