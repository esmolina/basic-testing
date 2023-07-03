import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 5;
    const usersAccount = getBankAccount(initialBalance);
    expect(usersAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 5;
    const withdrawAmount = 10;
    const usersAccount = getBankAccount(initialBalance);
    expect(() => usersAccount.withdraw(withdrawAmount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialFirstUserBalance = 5;
    const initialSecondUserBalance = 1;
    const transferAmount = 10;
    const firstUsersAccount = getBankAccount(initialFirstUserBalance);
    const secondUsersAccount = getBankAccount(initialSecondUserBalance);
    expect(() =>
      firstUsersAccount.transfer(transferAmount, secondUsersAccount),
    ).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 10;
    const transferAmount = 5;
    const usersAccount = getBankAccount(initialBalance);
    expect(() => usersAccount.transfer(transferAmount, usersAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const initialBalance = 10;
    const depositAmount = 5;
    const totalAmount = initialBalance + depositAmount;
    const usersAccount = getBankAccount(initialBalance);
    usersAccount.deposit(depositAmount);
    expect(usersAccount.getBalance()).toBe(totalAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 10;
    const withdrawAmount = 5;
    const totalAmount = initialBalance - withdrawAmount;
    const usersAccount = getBankAccount(initialBalance);
    usersAccount.withdraw(withdrawAmount);
    expect(usersAccount.getBalance()).toBe(totalAmount);
  });

  test('should transfer money', () => {
    const initialFirstUserBalance = 10;
    const initialSecondUserBalance = 1;
    const transferAmount = 5;
    const firstUserBalanceAfterTransfer =
      initialFirstUserBalance - transferAmount;
    const secondUserBalanceAfterTransfer =
      initialSecondUserBalance + transferAmount;

    const firstUsersAccount = getBankAccount(initialFirstUserBalance);
    const secondUsersAccount = getBankAccount(initialSecondUserBalance);

    firstUsersAccount.transfer(transferAmount, secondUsersAccount);

    expect(firstUsersAccount.getBalance()).toBe(firstUserBalanceAfterTransfer);
    expect(secondUsersAccount.getBalance()).toBe(
      secondUserBalanceAfterTransfer,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 5;
    const usersAccount = getBankAccount(initialBalance);
    const fetchedBalance = await usersAccount.fetchBalance();
    expect(typeof fetchedBalance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 5;
    const usersAccount = getBankAccount(initialBalance);

    await usersAccount.synchronizeBalance();
    await expect(usersAccount.getBalance()).toBeGreaterThan(initialBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 0;
    const usersAccount = getBankAccount(initialBalance);

    await expect(usersAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
