export function throttle(handler, options) {
    let timeLeft = null;
    let result;
    let wait = false;

    function invoke(...args) {
      try {
        result = handler.apply(this, args);
      } catch (err) {
          onError(err);
      }
      return result;
    }

    function cancel() {
      wait = true;
      clearTimeout(timeLeft);
    }

    function onError(error) {
      return error;
    }
  
    //throttled function is used to moderate the invocation of the handler
    function throttled(...args) {
      if(!options.leading) {
        wait = true;

        if(timeLeft > 0) {
          superHandler.cancel();
        }   

        timeLeft = setTimeout(() => {
          superHandler.invoke(...args);
          wait = false;
        }, options.delay);
        
      } else {     
        if(wait == false)   
        superHandler.invoke(...args);
        wait = true;

        timeLeft = setTimeout(() => {
          wait = false;
        }, options.delay);
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

  function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  // Example usage
  const calculate = (num) => num;
  const throttled = throttle(calculate, { delay: 30 });
  // Usage
  throttled(1); 
  throttled(2); 
  throttled(3); 
  throttled(4); 
