import { useState, useEffect } from 'react'
import { Search, Plus, Eye, Edit, X, UserX, UserCheck, ShoppingBag } from 'lucide-react'
import api from '../api'

const fmt = n => `₨ ${(n || 0).toLocaleString()}`

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [pages, setPages]         = useState(1)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [modal, setModal]         = useState(null) // null | 'add' | 'edit' | 'view'
  const [selected, setSelected]   = useState(null)
  const [orders, setOrders]       = useState([])
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState({})

  const load = async (p = 1) => {
    setLoading(true)
    try {
      const { data } = await api.get('/customers', { params: { search, page: p, limit: 15 } })
      setCustomers(data.customers); setTotal(data.total); setPages(data.pages); setPage(p)
    } finally { setLoading(false) }
  }

  useEffect(() => { const t = setTimeout(() => load(1), 300); return () => clearTimeout(t) }, [search])

  const openAdd = () => {
    setForm({ name: '', email: '', phone: '', address: '', city: '', notes: '' })
    setModal('add')
  }

  const openEdit = (c) => {
    setForm({ ...c })
    setSelected(c)
    setModal('edit')
  }

  const openView = async (c) => {
    setSelected(c)
    setOrders([])
    setModal('view')
    try {
      const { data } = await api.get(`/customers/${c._id}`)
      setSelected(data.customer)
      setOrders(data.orders)
    } catch {}
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (modal === 'edit') await api.put(`/customers/${selected._id}`, form)
      else await api.post('/customers', form)
      setModal(null); load(page)
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
    finally { setSaving(false) }
  }

  const toggleBlock = async (c) => {
    if (!confirm(`${c.isBlocked ? 'Unblock' : 'Block'} ${c.name}?`)) return
    await api.put(`/customers/${c._id}/block`)
    load(page)
  }

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Customers</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Total: <b style={{ color: 'var(--green)' }}>{total}</b> customers</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary"><Plus size={15} /> Add Customer</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 400 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone..."
          className="form-input" style={{ paddingLeft: 36 }} />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th><th>Phone</th><th>City</th>
                <th>Orders</th><th>Total Spent</th><th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}><span className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No customers found</td></tr>
              ) : customers.map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#000', flexShrink: 0 }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ color: 'var(--text)', fontWeight: 600 }}>{c.name}</p>
                        <p style={{ color: 'var(--muted)', fontSize: 11 }}>{c.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--sub)' }}>{c.phone || '—'}</td>
                  <td style={{ color: 'var(--muted)' }}>{c.city || '—'}</td>
                  <td style={{ color: 'var(--text)', fontWeight: 700 }}>{c.totalOrders}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 700 }}>{fmt(c.totalSpent)}</td>
                  <td>
                    {c.isBlocked
                      ? <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)' }}>Blocked</span>
                      : <span className="badge" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--green)' }}>Active</span>}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openView(c)} className="btn btn-ghost btn-sm" title="View Profile"><Eye size={13} /></button>
                      <button onClick={() => openEdit(c)} className="btn btn-ghost btn-sm" title="Edit"><Edit size={13} /></button>
                      <button onClick={() => toggleBlock(c)} className="btn btn-sm"
                        style={{ background: c.isBlocked ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${c.isBlocked ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`, color: c.isBlocked ? 'var(--green)' : 'var(--red)', cursor: 'pointer' }}
                        title={c.isBlocked ? 'Unblock' : 'Block'}>
                        {c.isBlocked ? <UserCheck size={13} /> : <UserX size={13} />}
                      </button>
                    </div>
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

      {/* Add / Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                {modal === 'edit' ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button onClick={() => setModal(null)} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Full Name *</label>
                    <input value={form.name || ''} onChange={e => inp('name', e.target.value)} required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" value={form.email || ''} onChange={e => inp('email', e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input value={form.phone || ''} onChange={e => inp('phone', e.target.value)} className="form-input" placeholder="+92 300 0000000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input value={form.city || ''} onChange={e => inp('city', e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input value={form.address || ''} onChange={e => inp('address', e.target.value)} className="form-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Notes</label>
                    <textarea value={form.notes || ''} onChange={e => inp('notes', e.target.value)} rows={2} className="form-input" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setModal(null)} className="btn btn-danger">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? <span className="spinner" /> : modal === 'edit' ? 'Update Customer' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {modal === 'view' && selected && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#000' }}>
                  {selected.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{selected.name}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 12 }}>{selected.email || 'No email'}</p>
                </div>
              </div>
              <button onClick={() => setModal(null)} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <div className="modal-body">
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Total Orders', value: selected.totalOrders, color: 'var(--blue)' },
                  { label: 'Total Spent', value: fmt(selected.totalSpent), color: 'var(--green)' },
                  { label: 'Status', value: selected.isBlocked ? 'Blocked' : 'Active', color: selected.isBlocked ? 'var(--red)' : 'var(--green)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 4 }}>{label}</p>
                    <p style={{ color, fontWeight: 800, fontSize: 16, fontFamily: "'Rajdhani',sans-serif" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  ['Phone', selected.phone || '—'],
                  ['City', selected.city || '—'],
                  ['Address', selected.address || '—'],
                  ['Joined', new Date(selected.createdAt).toLocaleDateString()],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
                    <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 3 }}>{label}</p>
                    <p style={{ color: 'var(--sub)', fontSize: 13 }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Order History */}
              <div>
                <h4 style={{ color: 'var(--text)', fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBag size={15} style={{ color: 'var(--green)' }} /> Order History
                </h4>
                {orders.length === 0 ? (
                  <p style={{ color: 'var(--muted)', fontSize: 13 }}>No orders found</p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>Order #</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o._id}>
                            <td style={{ color: 'var(--green)', fontWeight: 700 }}>{o.orderNumber}</td>
                            <td>{o.items.length}</td>
                            <td style={{ color: 'var(--text)', fontWeight: 700 }}>{fmt(o.total)}</td>
                            <td><span className={`badge status-${o.status}`}>{o.status}</span></td>
                            <td style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
