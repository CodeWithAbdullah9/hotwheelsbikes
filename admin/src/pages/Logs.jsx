import { useState, useEffect } from 'react'
import { FileText, Package, RefreshCw } from 'lucide-react'
import api from '../api'

export default function Logs() {
  const [tab, setTab]           = useState('system')
  const [systemLogs, setSystemLogs] = useState([])
  const [stockLogs, setStockLogs]   = useState([])
  const [sysTotal, setSysTotal]     = useState(0)
  const [stockTotal, setStockTotal] = useState(0)
  const [sysPage, setSysPage]       = useState(1)
  const [stockPage, setStockPage]   = useState(1)
  const [loading, setLoading]       = useState(false)

  const loadSystem = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await api.get('/logs/system', { params: { page: p, limit: 30 } })
      setSystemLogs(data.logs); setSysTotal(data.total); setSysPage(p)
    } finally { setLoading(false) }
  }

  const loadStock = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await api.get('/logs/stock', { params: { page: p, limit: 30 } })
      setStockLogs(data.logs); setStockTotal(data.total); setStockPage(p)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (tab === 'system') loadSystem(1)
    else loadStock(1)
  }, [tab])

  const sysPages   = Math.ceil(sysTotal / 30)
  const stockPages = Math.ceil(stockTotal / 30)

  const typeColor = {
    add:    { bg: 'rgba(74,222,128,0.12)',  color: '#4ade80' },
    remove: { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
    adjust: { bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
    sale:   { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
    return: { bg: 'rgba(96,165,250,0.12)',  color: '#60a5fa' },
  }

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>System Logs</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Complete audit trail of all admin actions</p>
        </div>
        <button onClick={() => tab === 'system' ? loadSystem(sysPage) : loadStock(stockPage)} className="btn btn-ghost btn-sm">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'system', label: 'System Logs', icon: FileText, count: sysTotal },
          { id: 'stock', label: 'Stock Logs', icon: Package, count: stockTotal },
        ].map(({ id, label, icon: Icon, count }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === id ? 'var(--green)' : 'var(--muted)',
              fontWeight: 700, fontSize: 13,
              borderBottom: tab === id ? '2px solid var(--green)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
            <Icon size={15} />{label}
            <span style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--green)', borderRadius: 99, padding: '1px 8px', fontSize: 11 }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* System Logs */}
      {tab === 'system' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Time</th><th>Admin</th><th>Module</th><th>Action</th><th>IP</th><th>Details</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}><span className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                ) : systemLogs.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No system logs found</td></tr>
                ) : systemLogs.map(log => (
                  <tr key={log._id}>
                    <td style={{ color: 'var(--muted)', fontSize: 11, whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{log.admin?.name || 'System'}</p>
                      <p style={{ color: 'var(--muted)', fontSize: 11 }}>{log.admin?.email || ''}</p>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa' }}>
                        {log.module}
                      </span>
                    </td>
                    <td style={{ color: 'var(--sub)', fontSize: 13 }}>{log.action}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 11 }}>{log.ip || '—'}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 11, maxWidth: 200 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.details ? (() => {
                          try { const d = JSON.parse(log.details); return JSON.stringify(d.body || d).slice(0, 80) }
                          catch { return log.details.slice(0, 80) }
                        })() : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sysPages > 1 && (
            <div className="pagination" style={{ padding: '12px 20px' }}>
              {Array.from({ length: sysPages }, (_, i) => (
                <button key={i + 1} onClick={() => loadSystem(i + 1)} className={`page-btn ${sysPage === i + 1 ? 'active' : ''}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stock Logs */}
      {tab === 'stock' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Time</th><th>Product</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Admin</th><th>Reference</th><th>Note</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40 }}><span className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                ) : stockLogs.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No stock logs found</td></tr>
                ) : stockLogs.map(log => {
                  const tc = typeColor[log.type] || { bg: 'rgba(74,222,128,0.12)', color: 'var(--green)' }
                  return (
                    <tr key={log._id}>
                      <td style={{ color: 'var(--muted)', fontSize: 11, whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{log.product?.name || '—'}</p>
                        <p style={{ color: 'var(--muted)', fontSize: 11 }}>{log.product?.sku || ''}</p>
                      </td>
                      <td>
                        <span className="badge" style={{ background: tc.bg, color: tc.color }}>
                          {log.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: ['add', 'return'].includes(log.type) ? 'var(--green)' : 'var(--red)' }}>
                        {['add', 'return'].includes(log.type) ? '+' : '-'}{log.quantity}
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{log.before}</td>
                      <td style={{ color: 'var(--text)', fontWeight: 700 }}>{log.after}</td>
                      <td style={{ color: 'var(--sub)', fontSize: 13 }}>{log.admin?.name || '—'}</td>
                      <td style={{ color: 'var(--green)', fontSize: 12 }}>{log.reference || '—'}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{log.note || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {stockPages > 1 && (
            <div className="pagination" style={{ padding: '12px 20px' }}>
              {Array.from({ length: stockPages }, (_, i) => (
                <button key={i + 1} onClick={() => loadStock(i + 1)} className={`page-btn ${stockPage === i + 1 ? 'active' : ''}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
