import { doStuffByTimeout, doStuffByInterval } from '.';
import { readFileAsynchronously } from '.';
import { join } from 'path';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const providedCallback = jest.fn();
    const providedTimeout = 5000;

    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(providedCallback, providedTimeout);

    expect(setTimeout).toHaveBeenCalledWith(
      expect.any(Function),
      providedTimeout,
    );
  });

  test('should call callback only after timeout', () => {
    const providedCallback = jest.fn();
    const providedTimeout = 20000;

    doStuffByTimeout(providedCallback, providedTimeout);
    expect(providedCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(providedTimeout);
    expect(providedCallback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const providedCallback = jest.fn();
    const providedTimeout = 20000;

    jest.spyOn(global, 'setInterval');
    doStuffByInterval(providedCallback, providedTimeout);

    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      providedTimeout,
    );
  });

  test('should call callback multiple times after multiple intervals', () => {
    const providedCallback = jest.fn();
    const providedTimeout = 20000;

    jest.spyOn(global, 'setInterval');

    doStuffByInterval(providedCallback, providedTimeout);
    doStuffByInterval(providedCallback, providedTimeout);
    doStuffByInterval(providedCallback, providedTimeout);

    expect(setInterval).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'testJoin.txt';
    jest.mock('fs/promises');
    jest.mock('path', () => ({
      join: jest.fn().mockReturnValue('home/RSS/testJoin.txt'),
    }));

    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  // test('should return null if file does not exist', async () => {
  //   // Write your test here
  // });
  //
  // test('should return file content if file exists', async () => {
  //   // Write your test here
  // });
});
