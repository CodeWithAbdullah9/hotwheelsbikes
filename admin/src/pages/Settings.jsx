import { useState, useEffect } from 'react'
import { Save, Plus, Edit, Trash2, X, Eye, EyeOff, Shield, Store, Users, CreditCard, CheckCircle, Building2, Smartphone, Wallet, Banknote } from 'lucide-react'
import api from '../api'
import { useAuth } from '../App'

const ROLES = ['super_admin', 'inventory_manager', 'pos_operator']
const ROLE_LABELS = { super_admin: 'Super Admin', inventory_manager: 'Inventory Manager', pos_operator: 'POS Operator' }

export default function Settings() {
  const { admin: currentAdmin } = useAuth()
  const [tab, setTab] = useState('store')
  const [settings, setSettings] = useState(null)
  const [admins, setAdmins] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data)).catch(() => { })
    api.get('/settings/admins').then(r => setAdmins(r.data)).catch(() => { })
  }, [])

  const saveSettings = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const { data } = await api.put('/settings', settings)
      setSettings(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) { alert(err.response?.data?.message || 'Error saving') }
    finally { setSaving(false) }
  }

  const openAddAdmin = () => {
    setForm({ name: '', email: '', password: '', role: 'pos_operator', isActive: true })
    setSelected(null)
    setModal('admin')
  }

  const openEditAdmin = (a) => {
    setForm({ name: a.name, email: a.email, role: a.role, isActive: a.isActive, password: '' })
    setSelected(a)
    setModal('admin')
  }

  const saveAdmin = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.password) delete payload.password
      if (selected) await api.put(`/settings/admins/${selected._id}`, payload)
      else await api.post('/settings/admins', payload)
      const { data } = await api.get('/settings/admins')
      setAdmins(data)
      setModal(null)
    } catch (err) { alert(err.response?.data?.message || 'Error saving admin') }
    finally { setSaving(false) }
  }

  const deleteAdmin = async (a) => {
    if (!confirm(`Delete admin "${a.name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/settings/admins/${a._id}`)
      setAdmins(prev => prev.filter(x => x._id !== a._id))
    } catch (err) { alert(err.response?.data?.message || 'Error deleting') }
  }

  const inp = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))

  const TABS = [
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'admins', label: 'Admin Users', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 3 }}>Settings</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>Manage store configuration and admin users</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '10px 14px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: tab === id ? 'var(--green)' : 'var(--muted)',
              fontWeight: 700, fontSize: 12,
              borderBottom: tab === id ? '2px solid var(--green)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
              flexShrink: 0, whiteSpace: 'nowrap',
            }}>
            <Icon size={14} />{label}
          </button>
        ))}
      </div>

      {/* Store Settings */}
      {tab === 'store' && settings && (
        <form onSubmit={saveSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            <div className="card">
              <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Store Information</h3>
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input value={settings.storeName || ''} onChange={e => set('storeName', e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" value={settings.email || ''} onChange={e => set('email', e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input value={settings.phone || ''} onChange={e => set('phone', e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea value={settings.address || ''} onChange={e => set('address', e.target.value)} rows={2} className="form-input" />
              </div>
            </div>

            {/* Business Settings */}
            <div className="card">
              <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Business Settings</h3>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select value={settings.currency || 'PKR'} onChange={e => set('currency', e.target.value)} className="form-input">
                  <option value="PKR">PKR — Pakistani Rupee</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <input type="number" min="0" max="100" step="0.1"
                  value={settings.taxRate ?? 0} onChange={e => set('taxRate', parseFloat(e.target.value))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Default Shipping Cost</label>
                <input type="number" min="0"
                  value={settings.shippingCost ?? 0} onChange={e => set('shippingCost', parseFloat(e.target.value))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Low Stock Default Threshold</label>
                <input type="number" min="1"
                  value={settings.lowStockDefault ?? 5} onChange={e => set('lowStockDefault', parseInt(e.target.value))} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Invoice Prefix</label>
                <input value={settings.invoicePrefix || 'HW'} onChange={e => set('invoicePrefix', e.target.value)} className="form-input" placeholder="HW" />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
            {saved && (
              <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Settings saved!</span>
            )}
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '11px 28px' }}>
              {saving ? <span className="spinner" /> : <><Save size={15} /> Save Settings</>}
            </button>
          </div>
        </form>
      )}

      {/* Payment Methods */}
      {tab === 'payment' && settings && (
        <form onSubmit={saveSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>

            {/* COD */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Banknote size={16} style={{ color: 'var(--green)' }} /> Cash on Delivery</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.codEnabled ?? true} onChange={e => set('codEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Enabled</span>
                </label>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 12 }}>Customer pays when order is delivered. No setup required.</p>
            </div>

            {/* Bank Transfer */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Building2 size={16} style={{ color: 'var(--green)' }} /> Bank Transfer</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.bankEnabled ?? true} onChange={e => set('bankEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Enabled</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input value={settings.bankName || ''} onChange={e => set('bankName', e.target.value)} className="form-input" placeholder="HBL / Meezan / UBL" />
              </div>
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input value={settings.bankAccountName || ''} onChange={e => set('bankAccountName', e.target.value)} className="form-input" placeholder="Hot Wheels Bikes" />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input value={settings.bankAccountNo || ''} onChange={e => set('bankAccountNo', e.target.value)} className="form-input" placeholder="0123456789" />
              </div>
              <div className="form-group">
                <label className="form-label">IBAN</label>
                <input value={settings.bankIBAN || ''} onChange={e => set('bankIBAN', e.target.value)} className="form-input" placeholder="PK00XXXX0000000000000000" />
              </div>
            </div>

            {/* JazzCash */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Smartphone size={16} style={{ color: 'var(--green)' }} /> JazzCash</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.jazzcashEnabled ?? true} onChange={e => set('jazzcashEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Enabled</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">JazzCash Number</label>
                <input value={settings.jazzcashNumber || ''} onChange={e => set('jazzcashNumber', e.target.value)} className="form-input" placeholder="03XX-XXXXXXX" />
              </div>
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input value={settings.jazzcashName || ''} onChange={e => set('jazzcashName', e.target.value)} className="form-input" placeholder="Hot Wheels Bikes" />
              </div>
            </div>

            {/* EasyPaisa */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={16} style={{ color: 'var(--green)' }} /> EasyPaisa</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.easypaisaEnabled ?? true} onChange={e => set('easypaisaEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Enabled</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">EasyPaisa Number</label>
                <input value={settings.easypaisaNumber || ''} onChange={e => set('easypaisaNumber', e.target.value)} className="form-input" placeholder="03XX-XXXXXXX" />
              </div>
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input value={settings.easypaisaName || ''} onChange={e => set('easypaisaName', e.target.value)} className="form-input" placeholder="Hot Wheels Bikes" />
              </div>
            </div>

            {/* Stripe */}
            <div className="card" style={{ gridColumn: '1/-1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><CreditCard size={16} style={{ color: 'var(--green)' }} /> Stripe (International Cards)</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.stripeEnabled ?? false} onChange={e => set('stripeEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Enabled</span>
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Stripe Public Key</label>
                  <input value={settings.stripePublicKey || ''} onChange={e => set('stripePublicKey', e.target.value)} className="form-input" placeholder="pk_test_..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Stripe Secret Key (in .env)</label>
                  <input value="Set in backend/.env as STRIPE_SECRET_KEY" disabled className="form-input" style={{ opacity: 0.5 }} />
                </div>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>
                Get keys from <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" style={{ color: 'var(--green)' }}>dashboard.stripe.com/apikeys</a>
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
            {saved && <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={14} /> Payment settings saved!</span>}
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '11px 28px' }}>
              {saving ? <span className="spinner" /> : <><Save size={15} /> Save Payment Settings</>}
            </button>
          </div>
        </form>
      )}

      {/* Admin Users */}
      {tab === 'admins' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button onClick={openAddAdmin} className="btn btn-primary"><Plus size={15} /> Add Admin</button>
          </div>
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
                <tbody>
                  {admins.map(a => (
                    <tr key={a._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, color: '#000' }}>
                            {a.name[0].toUpperCase()}
                          </div>
                          <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                            {a.name}
                            {a._id === currentAdmin?._id && <span style={{ color: 'var(--green)', fontSize: 10, marginLeft: 6 }}>(You)</span>}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--muted)' }}>{a.email}</td>
                      <td>
                        <span className="badge" style={{
                          background: a.role === 'super_admin' ? 'rgba(74,222,128,0.12)' : a.role === 'inventory_manager' ? 'rgba(96,165,250,0.12)' : 'rgba(192,132,252,0.12)',
                          color: a.role === 'super_admin' ? 'var(--green)' : a.role === 'inventory_manager' ? '#60a5fa' : '#c084fc',
                        }}>
                          {ROLE_LABELS[a.role]}
                        </span>
                      </td>
                      <td>
                        {a.isActive
                          ? <span className="badge" style={{ background: 'rgba(74,222,128,0.12)', color: 'var(--green)' }}>Active</span>
                          : <span className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)' }}>Inactive</span>}
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                        {a.lastLogin ? new Date(a.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openEditAdmin(a)} className="btn btn-ghost btn-sm"><Edit size={13} /></button>
                          {a._id !== currentAdmin?._id && (
                            <button onClick={() => deleteAdmin(a)} className="btn btn-danger btn-sm"><Trash2 size={13} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Security / Change Password */}
      {tab === 'security' && (
        <div style={{ maxWidth: 480 }}>
          <ChangePassword />
        </div>
      )}

      {/* Add/Edit Admin Modal */}
      {modal === 'admin' && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                {selected ? 'Edit Admin' : 'Add New Admin'}
              </h3>
              <button onClick={() => setModal(null)} className="btn btn-danger btn-sm"><X size={15} /></button>
            </div>
            <form onSubmit={saveAdmin}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input value={form.name || ''} onChange={e => inp('name', e.target.value)} required className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" value={form.email || ''} onChange={e => inp('email', e.target.value)} required className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">{selected ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} value={form.password || ''} onChange={e => inp('password', e.target.value)}
                      required={!selected} className="form-input" style={{ paddingRight: 40 }} placeholder={selected ? 'Leave blank to keep current' : ''} />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex' }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select value={form.role || 'pos_operator'} onChange={e => inp('role', e.target.value)} className="form-input">
                    {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select value={form.isActive ? 'true' : 'false'} onChange={e => inp('isActive', e.target.value === 'true')} className="form-input">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setModal(null)} className="btn btn-danger">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? <span className="spinner" /> : selected ? 'Update Admin' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirm) return setMsg({ type: 'error', text: 'Passwords do not match' })
    if (form.newPassword.length < 6) return setMsg({ type: 'error', text: 'Password must be at least 6 characters' })
    setSaving(true)
    try {
      await api.put('/auth/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword })
      setMsg({ type: 'success', text: 'Password changed successfully!' })
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error changing password' })
    } finally { setSaving(false) }
  }

  return (
    <div className="card">
      <h3 style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Shield size={16} style={{ color: 'var(--green)' }} /> Change Password
      </h3>
      <form onSubmit={handleSubmit}>
        {['currentPassword', 'newPassword', 'confirm'].map((field, i) => (
          <div key={field} className="form-group">
            <label className="form-label">
              {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
            </label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                required className="form-input" style={{ paddingRight: 40 }} />
              {i === 0 && (
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex' }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {msg && (
          <div style={{
            padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 13, fontWeight: 600,
            background: msg.type === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${msg.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: msg.type === 'success' ? 'var(--green)' : 'var(--red)',
          }}>
            {msg.text}
          </div>
        )}
        <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
          {saving ? <span className="spinner" /> : 'Change Password'}
        </button>
      </form>
    </div>
  )
}
