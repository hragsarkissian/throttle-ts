import { throttle } from './throttle.ts';

let fn;
const heavyLoadCallsCount = 100000;

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

    test('leading throttle invoke first event only', async () => {
      const throttleFn = throttle(fn, { delay: 30, leading: true });
  
      throttleFn(1);
      throttleFn(2);
      throttleFn(3);
      throttleFn(4);
      expect(fn).toHaveBeenCalledTimes(1);
    });
})