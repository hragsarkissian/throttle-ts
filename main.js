// const options1 = {
//   delay: 1000,
//   leading: false,
//   onError: function (error) {
//     // Error handler implementation
//   }
// };
export function throttle(handler, options) {
    let timeLeft = null;
    let result;

    function invoke(...args) {
      try {
        result = handler.apply(this, args);
      } catch (err) {
          onError(err);
      }
      return result;
    }

    function cancel() {
      console.log("canceled");
      clearTimeout(timeLeft);
      timeLeft = null;
    }

    function onError(error) {
      return error;
    }
  
    //throttled function is used to moderate the invocation of the handler
    function throttled(...args) {

      if(!options.leading) {
        if(timeLeft > 0) {
          superHandler.cancel()
        }   

        timeLeft = setTimeout(() => {
          superHandler.invoke(...args);
        }, options.delay);
        
      } else {
        superHandler.invoke(...args);

        timeoutId = setTimeout(() => {
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
wait(35)

