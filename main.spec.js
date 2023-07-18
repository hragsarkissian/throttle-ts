import { throttle } from './main';
//fix the import issue asap

describe('throttle', () => {
    const options = {
      delay: 1000,
      leading: true,
      onError: jest.fn(),
    };
  
    function wait(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
  
    it('should invoke the handler immediately and return the correct result on leading edge invocation', () => {
      const calculate = jest.fn(num => num * 2);
      const superHandler = throttle(calculate, options);
  
      const output = superHandler(10);
  
      expect(calculate).toHaveBeenCalledTimes(1);
      expect(calculate).toHaveBeenCalledWith(10);
      expect(output).toBe(20);
    });

    it('should skip invocation and return undefined on multiple invocations within the delay period', () => {
        const calculate = jest.fn(num => num * 2);
        const superHandler = throttle(calculate, options);
    
        const output1 = superHandler(20);
        const output2 = superHandler.invoke(30);
    
        expect(calculate).toHaveBeenCalledTimes(2);
        expect(calculate).toHaveBeenCalledWith(20);
        expect(output1).toBe(40);
        expect(output2).toBe(60);
      });

      it('should invoke the handler after the delay period and return the correct result', async () => {
        const calculate = jest.fn(num => num * 2);
        const superHandler = throttle(calculate, options);
    
        const output1 = superHandler(40);
        wait(1000);
        const output2 = superHandler(30);
        wait(1000);
        const output3 = superHandler(40);

        expect(calculate).toHaveBeenCalledTimes(1);
        expect(calculate).toHaveBeenCalledWith(40);
        expect(output1).toBe(80);
        expect(output2).toBe(80);
        expect(output3).toBe(80);

      });
})
