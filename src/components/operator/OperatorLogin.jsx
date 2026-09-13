/* eslint-disable react/prop-types */

import { useState } from 'react';
import { ArrowLeft, ArrowRight, LockFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export function OperatorLogin({ isAuthenticating, notice, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password || isAuthenticating) return;
    onLogin({ email: email.trim(), password });
  };

  return (
    <main className="operator-login-shell">
      <Link className="operator-back-link" to="/about">
        <ArrowLeft aria-hidden="true" />
        Portfolio
      </Link>

      <section className="operator-login-card" aria-labelledby="operator-login-title">
        <div className="operator-mark" aria-hidden="true">
          <span>Za</span><span>&lt;/</span>
        </div>
        <div className="operator-login-heading">
          <span className="operator-eyebrow"><LockFill aria-hidden="true" /> Private operator access</span>
          <h1 id="operator-login-title">Back at the desk.</h1>
          <p>Sign in to read and reply to portfolio conversations from this device.</p>
        </div>

        <form className="operator-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              autoComplete="username"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your operator password"
              type="password"
              value={password}
            />
          </label>

          {notice && <p className="operator-form-notice" role="alert">{notice}</p>}

          <button disabled={!email.trim() || !password || isAuthenticating} type="submit">
            <span>{isAuthenticating ? 'Checking…' : 'Open Zaka Desk'}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </form>

        <p className="operator-login-footnote">
          Your browser stores only a revocable operator token. Visitors cannot reach this desk without backend authentication.
        </p>
      </section>
    </main>
  );
}
