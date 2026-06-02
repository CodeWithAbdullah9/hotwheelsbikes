import { useState, useEffect } from 'react'
import { Search, Eye, X, CheckCircle, XCircle, Image } from 'lucide-react'
import api from '../api'

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const fmt = n => `₨ ${(n || 0).toLocaleString()}`

const PM_LABELS = {
  cod: 'Cash on Delivery', bank_transfer: 'Bank Transfer',
  jazzcash: 'JazzCash', easypaisa: 'EasyPaisa',
  stripe: 'Stripe Card', card: 'Card', online: 'Online', cash: 'Cash'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', status: '', source: '', from: '', to: '' })
  const [selected, setSelected] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancel, setShowCancel] = useState(false)
  const [showScreenshot, setShowScreenshot] = useState(false)
  const [stats, setStats] = useState({})

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await api.get('/orders', { params: { page: p, limit: 15, ...filters } })
      setOrders(data.orders); setTotal(data.total); setPages(data.pages); setPage(p)
    } finally { setLoading(false) }
  }

  const loadStats = async () => {
    try {
      const { data } = await api.get('/orders/stats/summary')
      setStats(data)
    } catch { /* ignore */ }
  }

  useEffect(() => {
    load(1)
    loadStats()
    const interval = setInterval(() => { load(page); loadStats() }, 15000)
    return () => clearInterval(interval)
  }, [filters])

  const updateStatus = async (id, status, reason = '') => {
    await api.put(`/orders/${id}/status`, { status, cancelReason: reason })
    load(page)
    if (selected?._id === id) {
      const { data } = await api.get(`/orders/${id}`)
      setSelected(data)
    }
  }

  const verifyPayment = async (id) => {
    await api.put(`/orders/${id}`, { paymentStatus: 'paid' })
    const { data } = await api.get(`/orders/${id}`)
    setSelected(data)
    load(page)
  }

  const viewOrder = async (id) => {
    const { data } = await api.get(`/orders/${id}`)
    setSelected(data)
  }

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Orders</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Total: <b style={{ color: 'var(--green)' }}>{total}</b></p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 15, marginBottom: 25 }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--green)', marginBottom: '6px' }}>
            {stats.total || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Total Orders</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--yellow)', marginBottom: '6px' }}>
            {stats.pending || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Pending</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '6px' }}>
            {stats.processing || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Processing</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--purple)', marginBottom: '6px' }}>
            {stats.shipped || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Shipped</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--green)', marginBottom: '6px' }}>
            {stats.delivered || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Delivered</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--red)', marginBottom: '6px' }}>
            {stats.cancelled || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Cancelled</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--green)', marginBottom: '6px' }}>
            ₨ {(stats.totalRevenue || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Total Revenue</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--blue)', marginBottom: '6px' }}>
            {stats.onlineOrders || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>Online Orders</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px 15px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--purple)', marginBottom: '6px' }}>
            {stats.posOrders || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: '500' }}>POS Orders</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="Order #, customer name, phone..."
            className="form-input" style={{ paddingLeft: 36 }} />
        </div>
        <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="form-input" style={{ width: 140 }}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.source} onChange={e => setFilters(f => ({ ...f, source: e.target.value }))} className="form-input" style={{ width: 120 }}>
          <option value="">All Sources</option>
          <option value="online">Online</option>
          <option value="pos">POS</option>
        </select>
        <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} className="form-input" style={{ width: 140 }} />
        <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} className="form-input" style={{ width: 140 }} />
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Pay Status</th><th>Source</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40 }}><span className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No orders found</td></tr>
              ) : orders.map(o => (
                <tr key={o._id}>
                  <td style={{ color: 'var(--green)', fontWeight: 700 }}>{o.orderNumber}</td>
                  <td>
                    <p style={{ color: 'var(--text)', fontWeight: 600 }}>{o.customer.name}</p>
                    <p style={{ color: 'var(--muted)', fontSize: 11 }}>{o.customer.phone}</p>
                  </td>
                  <td style={{ color: 'var(--muted)' }}>{o.items.length} item(s)</td>
                  <td style={{ color: 'var(--text)', fontWeight: 700 }}>{fmt(o.total)}</td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(74,222,128,0.1)', color: 'var(--green)', fontSize: 10 }}>
                      {PM_LABELS[o.paymentMethod] || o.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span className="badge" style={{
                      background: o.paymentStatus === 'paid' ? 'rgba(74,222,128,0.12)' : 'rgba(251,191,36,0.12)',
                      color: o.paymentStatus === 'paid' ? 'var(--green)' : '#fbbf24',
                      fontSize: 10
                    }}>
                      {o.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
                    </span>
                    {o.paymentScreenshot && (
                      <button onClick={() => { setSelected(o); setShowScreenshot(true) }}
                        className="btn btn-ghost btn-sm" style={{ marginLeft: 4, padding: '2px 6px' }} title="View Screenshot">
                        <Image size={11} />
                      </button>
                    )}
                  </td>
                  <td><span className="badge" style={{ background: o.source === 'pos' ? 'rgba(168,85,247,0.12)' : 'rgba(59,130,246,0.12)', color: o.source === 'pos' ? '#c084fc' : '#60a5fa' }}>{o.source}</span></td>
                  <td>
                    <select value={o.status} onChange={e => {
                      if (e.target.value === 'cancelled') { setSelected(o); setShowCancel(true) }
                      else updateStatus(o._id, e.target.value)
                    }}
                      className={`badge status-${o.status}`}
                      style={{ border: 'none', cursor: 'pointer', outline: 'none', fontWeight: 700, fontSize: 11 }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => viewOrder(o._id)} className="btn btn-ghost btn-sm"><Eye size={13} /> View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="pagination" style={{ padding: '12px 20px' }}>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i + 1} onClick={() => load(i + 1)} className={`page-btn ${page === i + 1 ? 'active' : ''}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {showScreenshot && selected && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                Payment Screenshot — {selected.orderNumber}
              </h3>
              <button onClick={() => { setShowScreenshot(false); setSelected(null) }} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <div className="modal-body">
              <img src={selected.paymentScreenshot} alt="Payment Screenshot"
                style={{ width: '100%', borderRadius: 12, border: '1px solid var(--border)' }}
                onError={e => e.target.src = 'https://placehold.co/400x300/132a18/4ade80?text=Screenshot+Not+Found'} />
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <p style={{ color: 'var(--muted)', fontSize: 12, flex: 1 }}>
                  Payment Method: <b style={{ color: 'var(--text)' }}>{PM_LABELS[selected.paymentMethod] || selected.paymentMethod}</b><br />
                  Amount: <b style={{ color: 'var(--green)' }}>{fmt(selected.total)}</b>
                </p>
                {selected.paymentStatus !== 'paid' && (
                  <button onClick={() => { verifyPayment(selected._id); setShowScreenshot(false) }}
                    className="btn btn-primary" style={{ gap: 6 }}>
                    <CheckCircle size={14} /> Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && !showCancel && !showScreenshot && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                Order — {selected.orderNumber}
              </h3>
              <button onClick={() => setSelected(null)} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                <div>
                  <p style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', marginBottom: 6 }}>Customer</p>
                  <p style={{ color: 'var(--text)', fontWeight: 600 }}>{selected.customer.name}</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>{selected.customer.email}</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>{selected.customer.phone}</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>{selected.customer.address}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', marginBottom: 6 }}>Order Info</p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>Date: <span style={{ color: 'var(--sub)' }}>{new Date(selected.createdAt).toLocaleString()}</span></p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>Payment: <span style={{ color: 'var(--sub)' }}>{PM_LABELS[selected.paymentMethod] || selected.paymentMethod}</span></p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>Pay Status:
                    <span className={`badge ${selected.paymentStatus === 'paid' ? 'status-delivered' : 'status-pending'}`} style={{ marginLeft: 6 }}>
                      {selected.paymentStatus}
                    </span>
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>Source: <span style={{ color: 'var(--sub)' }}>{selected.source}</span></p>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>Status: <span className={`badge status-${selected.status}`}>{selected.status}</span></p>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selected.paymentScreenshot && (
                <div style={{ marginBottom: 16, padding: 12, background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <p style={{ color: 'var(--green)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Image size={12} /> Payment Screenshot Uploaded</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setShowScreenshot(true)} className="btn btn-ghost btn-sm"><Image size={12} /> View</button>
                      {selected.paymentStatus !== 'paid' && (
                        <button onClick={() => verifyPayment(selected._id)} className="btn btn-primary btn-sm">
                          <CheckCircle size={12} /> Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="table-wrap" style={{ marginBottom: 16 }}>
                <table>
                  <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {selected.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--text)', fontWeight: 600 }}>{item.name}</td>
                        <td>{fmt(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td style={{ color: 'var(--green)', fontWeight: 700 }}>{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>Subtotal: {fmt(selected.subtotal)}</p>
                {selected.shippingCost > 0 && <p style={{ color: 'var(--muted)', fontSize: 13 }}>Shipping: {fmt(selected.shippingCost)}</p>}
                {selected.discount > 0 && <p style={{ color: 'var(--red)', fontSize: 13 }}>Discount: -{fmt(selected.discount)}</p>}
                <p style={{ color: 'var(--text)', fontSize: 18, fontWeight: 900, fontFamily: "'Rajdhani',sans-serif" }}>Total: {fmt(selected.total)}</p>
              </div>
              {selected.cancelReason && (
                <div style={{ marginTop: 14, padding: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                  <p style={{ color: 'var(--red)', fontSize: 13 }}>Cancel Reason: {selected.cancelReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && selected && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 style={{ color: 'var(--red)', fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700 }}>Cancel Order {selected.orderNumber}</h3>
              <button onClick={() => { setShowCancel(false); setSelected(null) }} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Cancellation Reason *</label>
                <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} className="form-input" placeholder="Enter reason for cancellation..." />
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => { setShowCancel(false); setSelected(null) }} className="btn btn-ghost">Back</button>
              <button onClick={async () => { await updateStatus(selected._id, 'cancelled', cancelReason); setShowCancel(false); setSelected(null); setCancelReason('') }} className="btn btn-danger">
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

