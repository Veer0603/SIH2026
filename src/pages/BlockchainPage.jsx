import React from 'react';
import BlockchainLedgerView from '../components/BlockchainLedgerView';
import { useApp } from '../context/useApp';

export default function BlockchainPage() {
  const { t } = useApp();

  return (
    <div>
      <div className="panel" style={{
        background: 'var(--color-surface)',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-panel)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="tag" style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', marginBottom: '8px', fontWeight: 600 }}>
          {t('blockchain.tag', 'Cryptographic Audit Trail')}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', marginBottom: '4px' }}>
          {t('blockchain.title', 'AeroLedger Environmental Blockchain Proofs & Sandbox')}
        </h1>
        <p className="muted" style={{ margin: 0, color: 'var(--text-muted)' }}>
          {t('blockchain.subtitle', 'Inspect immutable cryptographic block hashes, test anti-tamper fraud resistance, and explore Merkle trees for Delhi NCR monitoring nodes.')}
        </p>
      </div>

      <BlockchainLedgerView />
    </div>
  );
}
