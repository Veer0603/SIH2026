import React, { useState } from 'react';
import {
  getRecentLedgerBlocks,
  verifyStationBlockProof,
  simulateTamperVerification,
  getMerkleTreeHierarchy,
  generateBlockHeader
} from '../utils/blockchainLedger';
import { DELHI_STATIONS } from '../data/delhiStationsData';
import { exportToJSON } from '../utils/exportUtils';
import { useApp } from '../context/useApp';

export default function BlockchainLedgerView() {
  const { selectedStation, stations, addToast } = useApp();
  const stationList = stations;
  const [selectedProofStation, setSelectedProofStation] = useState(null);
  const [filterText, setFilterText] = useState('');

  // Tamper Sandbox State
  const [tamperStationId, setTamperStationId] = useState(selectedStation.id);
  const [forgedAqi, setForgedAqi] = useState(45);
  const [forgedPm25, setForgedPm25] = useState(25);
  const [tamperResult, setTamperResult] = useState(null);

  // Dynamic mined blocks
  const [blocks, setBlocks] = useState(() => getRecentLedgerBlocks(DELHI_STATIONS));

  const targetStation = stationList.find(s => s.id === tamperStationId) || selectedStation;
  const proofDetail = selectedProofStation ? verifyStationBlockProof(selectedProofStation) : null;
  const merkleTree = getMerkleTreeHierarchy(stationList);

  // Handle Mining / Committing new telemetry block
  const handleMineBlock = () => {
    const newBlockHeight = (blocks[0]?.blockHeight || 4189204) + 1;
    const now = new Date();
    const newBlock = {
      blockHeight: newBlockHeight,
      hash: generateBlockHeader(selectedStation, now.toISOString()),
      previousHash: blocks[0]?.hash || '0x0000000000000000000000000000000000000000000000000000000000000000',
      merkleRoot: `0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d`,
      stationId: selectedStation.id,
      stationName: selectedStation.shortName,
      aqi: selectedStation.aqi,
      pm25: selectedStation.pm25,
      pblHeight: selectedStation.pblHeight,
      validatorNode: `node-delhi-cpcb-01.aeroledger.org`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      smartContract: "0xAER0192837465019283746501928374650192837",
      status: "VERIFIED & IMMUTABLE"
    };

    setBlocks(prev => [newBlock, ...prev]);
    addToast(`Block #${newBlockHeight} mined and committed to AeroLedger!`, 'success');
  };

  const handleTestTampering = () => {
    const res = simulateTamperVerification(targetStation, parseInt(forgedAqi), parseFloat(forgedPm25));
    setTamperResult(res);
    if (res.isTampered) {
      addToast(`Adversary sensor injection REJECTED by consensus!`, 'alert');
    } else {
      addToast(`Sensor verification verified authentic`, 'success');
    }
  };

  const handleExportLedger = () => {
    exportToJSON(`aeroledger_blocks_${Date.now()}`, blocks);
    addToast('AeroLedger audit blocks exported to JSON', 'success');
  };

  const filteredBlocks = blocks.filter(b =>
    (b.stationName || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (b.hash || '').toLowerCase().includes(filterText.toLowerCase()) ||
    (b.blockHeight || '').toString().includes(filterText)
  );

  return (
    <div className="panel" id="blockchain-section">
      <div className="panel-header">
        <div>
          <div className="panel-title">
            <span>AEROLEDGER — IMMUTABLE ENVIRONMENTAL SENSOR PROOF-OF-AUTHORITY</span>
          </div>
          <span className="subtitle">
            Cryptographic SHA-256 verification and Merkle tree audit trails guaranteeing zero municipal or industrial tampering.
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleMineBlock} className="btn btn-sm">
            ⛏️ Mine & Commit Telemetry
          </button>
          <button onClick={handleExportLedger} className="btn btn-outline btn-sm">
            📥 Export JSON
          </button>
        </div>
      </div>

      {/* Selected Station Verification Action Bar */}
      <div style={{
        backgroundColor: 'var(--bg-panel-subtle)',
        padding: '16px 20px',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-card, 12px)',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            Selected Monitoring Target
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '2px' }}>
            {selectedStation.name}
          </div>
          <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '2px' }}>
            Hash: {selectedStation.blockchainHash}
          </div>
        </div>

        <button
          onClick={() => setSelectedProofStation(selectedStation)}
          className="btn btn-outline btn-sm"
          style={{ borderRadius: 'var(--radius-btn)', fontWeight: 700 }}
        >
          Verify Merkle Proof Receipt
        </button>
      </div>

      {/* Detailed Proof Modal/Panel if selected */}
      {selectedProofStation && proofDetail && (
        <div
          className="panel-subtle"
          style={{
            backgroundColor: 'var(--bg-panel)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-card, 12px)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '20px',
            padding: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ✓ AeroLedger Cryptographic Verification Receipt
            </span>
            <button
              onClick={() => setSelectedProofStation(null)}
              className="btn btn-outline btn-sm"
              style={{ borderRadius: 'var(--radius-btn)' }}
            >
              Close Receipt
            </button>
          </div>

          <div className="grid-2" style={{ gap: '14px', fontSize: '13px' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Block Height</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '15px' }}>#{proofDetail.blockHeight}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Validator Node Consensus</div>
              <div style={{ fontWeight: 800, color: 'var(--cpcb-good, #10b981)' }}>{proofDetail.validatorConsensus}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Merkle Tree Root</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', wordBreak: 'break-all', backgroundColor: 'var(--bg-panel-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                {proofDetail.merkleRoot}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Network & Smart Contract</div>
              <div>{proofDetail.network} | Address: <code style={{ backgroundColor: 'var(--bg-panel-subtle)', padding: '2px 6px', borderRadius: '4px' }}>0xAER0192837465019283746501928374650192837</code></div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: Interactive Anti-Tamper Security Sandbox */}
      <div className="panel" style={{ backgroundColor: 'var(--bg-panel-subtle)', marginBottom: '24px' }}>
        <div className="panel-header">
          <div>
            <div className="panel-title">
              <span>🛡️ INTERACTIVE ANTI-TAMPER SECURITY TEST SANDBOX</span>
            </div>
            <span className="subtitle">
              Simulate an adversary attempting to falsify CPCB telemetry readings to artificially lower AQI numbers.
            </span>
          </div>
          <span className="tag badge-sand">
            🛡️ Cryptographic Integrity Lab
          </span>
        </div>

        <div className="grid-2" style={{ gap: '16px', alignItems: 'center' }}>
          {/* Adversary Injection Form */}
          <div style={{ backgroundColor: 'var(--bg-panel)', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-card, 12px)', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Configure Forged Telemetry Injection:
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600 }}>Target Station:</label>
              <select
                className="input-select"
                value={tamperStationId}
                onChange={(e) => setTamperStationId(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {stationList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Real AQI: {s.aqi}, PM2.5: {s.pm25})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2" style={{ gap: '8px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Forged AQI Value:</label>
                <input
                  type="number"
                  className="input-text"
                  value={forgedAqi}
                  onChange={(e) => setForgedAqi(e.target.value)}
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>Forged PM2.5 (µg/m³):</label>
                <input
                  type="number"
                  className="input-text"
                  value={forgedPm25}
                  onChange={(e) => setForgedPm25(e.target.value)}
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>

            <button
              onClick={handleTestTampering}
              className="btn btn-sm"
              style={{ width: '100%', backgroundColor: '#991b1b', borderColor: '#991b1b', borderRadius: 'var(--radius-btn)' }}
            >
              🚨 Attempt Forged Telemetry Broadcast
            </button>
          </div>

          {/* Verification Audit Output */}
          <div>
            {tamperResult ? (
              <div style={{
                backgroundColor: tamperResult.isTampered ? 'var(--aqi-unhealthy-bg)' : 'var(--aqi-good-bg)',
                border: `2px solid ${tamperResult.isTampered ? 'var(--aqi-unhealthy-border)' : 'var(--aqi-good-border)'}`,
                color: tamperResult.isTampered ? 'var(--aqi-unhealthy-text)' : 'var(--aqi-good-text)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800 }}>
                    {tamperResult.status}
                  </span>
                  <span className="tag" style={{ fontSize: '10px' }}>
                    Consensus: {tamperResult.validatorConsensus}
                  </span>
                </div>

                <div style={{ fontSize: '12px', marginBottom: '8px', lineHeight: 1.5 }}>
                  {tamperResult.explanation}
                </div>

                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Authoritative Hash: {tamperResult.genuineHash.slice(0, 32)}...</div>
                  <div style={{ color: tamperResult.isTampered ? 'var(--aqi-unhealthy-text)' : 'inherit' }}>
                    Computed Forgery: {tamperResult.computedHash.slice(0, 32)}...
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>Cryptographic Anti-Tamper Engine Idle</p>
                <p style={{ fontSize: '12px', marginBottom: 0 }}>
                  Enter false data on the left and click "Attempt Forged Telemetry" to watch the decentralized PoA consensus detect and reject hash corruption.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature 2: Merkle Tree Proof Structure */}
      <div className="panel" style={{ marginBottom: '24px' }}>
        <div className="panel-header">
          <div className="panel-title">
            <span>MERKLE TREE ARCHITECTURE & LEAF HASH COMPILATION</span>
          </div>
          <span className="tag" style={{ backgroundColor: 'var(--bg-panel-subtle)' }}>
            Binary Hash Tree
          </span>
        </div>

        <div className="grid-3" style={{ gap: '14px', alignItems: 'center' }}>
          {/* Leaves */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Station Leaf Hashes (L1)
            </div>
            {merkleTree.leaves.map((l, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-page)', border: '1px solid var(--border-color)', padding: '6px 10px', fontSize: '11px' }}>
                <div style={{ fontWeight: 600 }}>{l.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{l.hash}</div>
              </div>
            ))}
          </div>

          {/* Intermediate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Intermediate Branch Hashes (L2)
            </div>
            {merkleTree.intermediate.map((b, i) => (
              <div key={i} style={{ backgroundColor: 'var(--bg-panel-subtle)', border: '1px solid var(--border-color)', padding: '10px', fontSize: '11px' }}>
                <div style={{ fontWeight: 700 }}>{b.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>{b.hash}</div>
              </div>
            ))}
          </div>

          {/* Root */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Top Merkle Root (Block Consensus)
            </div>
            <div style={{ backgroundColor: 'var(--accent-primary)', color: '#ffffff', padding: '16px', fontSize: '12px' }}>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>{merkleTree.root.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{merkleTree.root.hash}</div>
              <div style={{ fontSize: '10px', marginTop: '6px', opacity: 0.8 }}>
                Signed by 16 CPCB / DPCC validator nodes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Block Explorer Table */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <span>AEROLEDGER BLOCK EXPLORER ({blocks.length} COMMITTED BLOCKS)</span>
          </div>
          <input
            type="text"
            className="input-text"
            placeholder="Search block # or hash..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ width: '220px', padding: '5px 10px', fontSize: '12px' }}
          />
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
          <table className="data-table">
            <thead>
              <tr style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <th>Block Height</th>
                <th>Station</th>
                <th>AQI</th>
                <th>PM2.5 (µg/m³)</th>
                <th>Cryptographic Hash Receipt</th>
                <th>Timestamp</th>
                <th>Validator Node</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((block) => (
                <tr key={block.blockHeight}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>#{block.blockHeight}</td>
                  <td style={{ fontWeight: 600 }}>{block.stationName}</td>
                  <td style={{ fontWeight: 700 }}>{block.aqi}</td>
                  <td>{block.pm25}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {block.hash.slice(0, 16)}...{block.hash.slice(-8)}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{block.timestamp}</td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{block.validatorNode}</td>
                  <td>
                    <span className="tag" style={{ backgroundColor: 'var(--aqi-good-bg)', color: 'var(--aqi-good-text)', borderColor: 'var(--aqi-good-border)', fontSize: '10px' }}>
                      IMMUTABLE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
