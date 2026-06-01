import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Lock, Mail, Eye, EyeOff, AlertTriangle, ChevronRight, X, Bike } from 'lucide-react';
import api from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [remember, setRemember] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetError('Please enter your email');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      await api.post('/auth/forgot-password', { email: resetEmail });
      setResetSuccess(true);
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setResetLoading(false);
    }
  };

  // Rate limiting: Track failed attempts (5 attempts to match backend)
  useEffect(() => {
    if (attempts >= 5) {
      setLocked(true);
      setLockTimer(30);
      const timer = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [attempts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) return;

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.admin);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);

      // Handle backend lock
      if (err.response?.data?.locked) {
        setLocked(true);
        setLockTimer(err.response?.data?.remainingTime || 30);
      } else {
        setAttempts(prev => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        margin: '0 auto'
      }}>
        {/* Card */}
        <div style={{
          background: 'var(--raised)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 36,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}>
          {/* Logo/Brand */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#000',
              boxShadow: '0 10px 15px -3px rgba(74, 222, 128, 0.3)'
            }}>
              <Bike size={30} />
            </div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 6,
              letterSpacing: '-0.025em',
              fontFamily: "'Rajdhani', sans-serif"
            }}>
              Admin Panel
            </h1>
            <p style={{
              color: 'var(--muted)',
              fontSize: 14,
              margin: 0
            }}>
              Hot Wheels Bikes Management
            </p>
          </div>

          {/* Alert Messages */}
          {locked && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 12,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <div style={{
                background: 'rgba(248, 113, 113, 0.2)',
                borderRadius: 8,
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={16} style={{ color: 'var(--red)' }} />
              </div>
              <div>
                <div style={{ color: 'var(--red)', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
                  Too Many Failed Attempts
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                  Please wait {lockTimer}s before trying again
                </div>
              </div>
            </div>
          )}

          {error && !locked && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(248, 113, 113, 0.12)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: 12,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <AlertTriangle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
              <span style={{ color: 'var(--red)', fontSize: 13, fontWeight: 500 }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 8
              }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none'
                }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  disabled={locked}
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 14,
                    color: 'var(--text)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--green)';
                    e.target.style.background = 'var(--raised)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.background = 'var(--surface)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 8
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--muted)',
                  pointerEvents: 'none'
                }} />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  disabled={locked}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 14,
                    color: 'var(--text)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--green)';
                    e.target.style.background = 'var(--raised)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.background = 'var(--surface)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  disabled={locked}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: locked ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    padding: 4,
                    borderRadius: 6,
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    if (!locked) e.currentTarget.style.color = 'var(--green)';
                  }}
                  onMouseLeave={e => {
                    if (!locked) e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 28
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: locked ? 'not-allowed' : 'pointer',
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  disabled={locked}
                  style={{
                    width: 16,
                    height: 16,
                    accentColor: 'var(--green)',
                    cursor: locked ? 'not-allowed' : 'pointer',
                    borderRadius: 4
                  }}
                />
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetEmail(email);
                  setResetSuccess(false);
                  setResetError('');
                }}
                disabled={locked}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--green)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: locked ? 'not-allowed' : 'pointer',
                  padding: 0,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => {
                  if (!locked) e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={e => {
                  if (!locked) e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading || locked}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: loading || locked ? 'rgba(156, 163, 175, 0.3)' : 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                cursor: loading || locked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => {
                if (!loading && !locked) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(74, 222, 128, 0.4)';
                }
              }}
              onMouseLeave={e => {
                if (!loading && !locked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(0,0,0,0.2)',
                    borderTop: '2px solid #000',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : locked ? (
                <>
                  <AlertTriangle size={18} />
                  Locked ({lockTimer}s)
                </>
              ) : (
                <>
                  Sign In
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Admin Panel Footer Note */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 12,
          color: 'var(--muted)'
        }}>
          Secure Admin Access • Protected by encryption
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'var(--raised)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            padding: 32,
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text)',
                margin: 0,
                fontFamily: "'Rajdhani', sans-serif"
              }}>
                Reset Password
              </h2>
              <button
                onClick={() => setShowResetModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >
                <X size={20} />
              </button>
            </div>

            {resetSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'rgba(74, 222, 128, 0.12)',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <p style={{ color: 'var(--text)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  Reset Link Sent
                </p>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
                  If an account exists with this email, a password reset link has been sent.
                </p>
                <button
                  onClick={() => setShowResetModal(false)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(74, 222, 128, 0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text)',
                    marginBottom: 8
                  }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 12,
                      fontSize: 14,
                      color: 'var(--text)',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'var(--green)';
                      e.target.style.background = 'var(--raised)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.background = 'var(--surface)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {resetError && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(248, 113, 113, 0.12)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: 10,
                    marginBottom: 20,
                    color: 'var(--red)',
                    fontSize: 13
                  }}>
                    {resetError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: resetLoading ? 'rgba(156, 163, 175, 0.3)' : 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
                    color: '#000',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  onMouseEnter={e => {
                    if (!resetLoading) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(74, 222, 128, 0.4)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!resetLoading) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {resetLoading ? (
                    <>
                      <div style={{
                        width: 14,
                        height: 14,
                        border: '2px solid rgba(0,0,0,0.2)',
                        borderTop: '2px solid #000',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}