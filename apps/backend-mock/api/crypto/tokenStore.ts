// Mock token balance - in a real app, this would be a database or a more robust store.
interface TokenBalances {
  like: number;
  usdt: number;
}

export let userTokenBalances: TokenBalances = {
  like: 1000, // Initial "like" token balance
  usdt: 500,   // Initial USDT balance
};

export const updateUserTokenBalance = (tokenType: 'like' | 'usdt', amount: number): void => {
  if (userTokenBalances.hasOwnProperty(tokenType)) {
    userTokenBalances[tokenType] += amount;
  }
};

export const consumeTokens = (amount: number): boolean => {
  // Assuming "like" tokens are the primary currency for service consumption for now
  if (userTokenBalances.like >= amount) {
    userTokenBalances.like -= amount;
    return true;
  }
  return false;
};
