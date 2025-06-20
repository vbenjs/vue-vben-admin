import { NextApiRequest, NextApiResponse } from 'next';
import { userTokenBalances, updateUserTokenBalance } from './tokenStore';

interface RechargeRequest {
  tokenType: 'like' | 'usdt';
  amount: number;
}

interface RechargeResponse {
  message: string;
  newBalances: typeof userTokenBalances;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RechargeResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tokenType, amount } = req.body as RechargeRequest;

  if (!tokenType || amount == null) {
    return res.status(400).json({ error: 'Missing required fields: tokenType and amount' });
  }

  if (tokenType !== 'like' && tokenType !== 'usdt') {
    return res.status(400).json({ error: "Invalid tokenType. Must be 'like' or 'usdt'." });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  // Simulate adding tokens
  updateUserTokenBalance(tokenType, amount);

  return res.status(200).json({
    message: `${amount} ${tokenType.toUpperCase()} tokens added successfully.`,
    newBalances: userTokenBalances,
  });
}
