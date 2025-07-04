import { NextApiRequest, NextApiResponse } from 'next';

interface Holding {
  asset: string;
  amount: number;
  currentValue: number;
  purchasePrice: number;
}

interface Position {
  asset: string;
  entryPrice: number;
  exitPrice?: number;
  amount: number;
  timestamp: string;
  status: 'OPEN' | 'CLOSED';
}

interface PortfolioResponse {
  currentHoldings: Array<Holding>;
  historicalPositions: Array<Position>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PortfolioResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Mock data
  const currentHoldings: Array<Holding> = [
    { asset: 'Bitcoin', amount: 2.5, currentValue: 125000, purchasePrice: 45000 },
    { asset: 'Ethereum', amount: 10, currentValue: 30000, purchasePrice: 2500 },
    { asset: 'Cardano', amount: 5000, currentValue: 2500, purchasePrice: 0.4 },
  ];

  const historicalPositions: Array<Position> = [
    { asset: 'Solana', entryPrice: 80, exitPrice: 120, amount: 100, timestamp: '2023-10-15T10:00:00Z', status: 'CLOSED' },
    { asset: 'Polkadot', entryPrice: 5, amount: 200, timestamp: '2024-01-20T14:30:00Z', status: 'OPEN' },
    { asset: 'Dogecoin', entryPrice: 0.05, exitPrice: 0.15, amount: 100000, timestamp: '2023-05-01T08:20:00Z', status: 'CLOSED' },
  ];

  return res.status(200).json({ currentHoldings, historicalPositions });
}
