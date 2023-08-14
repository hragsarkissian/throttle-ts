import { throttle } from './main';
//fix the import issue asap

let fn;

beforeEach(() => {
  fn = jest.fn((a) => a);
});

describe('throttle', () => {
    function wait(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    test('throttle invoke last event only', async () => {
      const throttleFn = throttle(fn, { delay: 30 });

      throttleFn(1);
      throttleFn(2);
      throttleFn(3);
      throttleFn(4);
      expect(fn).toHaveBeenCalledTimes(0);
      await wait(35);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveReturnedWith(4);
    });
  
    // it('should invoke the handler immediately and return the correct result on leading edge invocation', () => {
    //   const calculate = jest.fn(num => num * 2);
    //   const superHandler = throttle(calculate, options);
  
    //   const output = superHandler(10);
  
    //   expect(calculate).toHaveBeenCalledTimes(1);
    //   expect(calculate).toHaveBeenCalledWith(10);
    //   expect(output).toBe(20);
    // });

    // it('should skip invocation and return undefined on multiple invocations within the delay period', () => {
    //     const calculate = jest.fn(num => num * 2);
    //     const superHandler = throttle(calculate, options);
    
    //     const output1 = superHandler(20);
    //     const output2 = superHandler.invoke(30);
    
    //     expect(calculate).toHaveBeenCalledTimes(2);
    //     expect(calculate).toHaveBeenCalledWith(20);
    //     expect(output1).toBe(40);
    //     expect(output2).toBe(60);
    //   });

      // it('should invoke the handler after the delay period and return the correct result', async () => {
      //   const calculate = jest.fn(num => num * 2);
      //   const superHandler = throttle(calculate, options);
    
      //   const output1 = superHandler(40);
      //   await wait(1200);
      //   const output2 = superHandler(30);
      //   await wait(1200);
      //   const output3 = superHandler(50);

      //   expect(calculate).toHaveBeenCalledTimes(3);
      //   expect(calculate).toHaveBeenCalledWith(40);
      //   expect(output1).toBe(80);
      //   expect(output2).toBe(60);
      //   expect(output3).toBe(100);

      // });
})