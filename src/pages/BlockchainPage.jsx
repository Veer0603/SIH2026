import React from 'react';
import BlockchainLedgerView from '../components/BlockchainLedgerView';
import { useApp } from '../context/useApp';

export default function BlockchainPage() {
  const { t } = useApp();

  return (
    <div>
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel-subtle)', marginBottom: '20px' }}>
        <div className="tag" style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', marginBottom: '6px' }}>
          {t('blockchain.tag', 'Cryptographic Audit Trail')}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800 }}>
          {t('blockchain.title', 'AeroLedger Environmental Blockchain Proofs & Sandbox')}
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          {t('blockchain.subtitle', 'Inspect immutable cryptographic block hashes, test anti-tamper fraud resistance, and explore Merkle trees for Delhi NCR monitoring nodes.')}
        </p>
      </div>

      <BlockchainLedgerView />
    </div>
  );
}
