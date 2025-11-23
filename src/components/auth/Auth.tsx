import { useFirebaseAuth } from '../../hooks/use-firebase-app.ts';

export function Auth() {
  const { user, loading, authError, dbResult, signInWithGoogle, logout, writeTestDoc, readTestDoc } = useFirebaseAuth();

  const isAuthed = !!user;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '2rem auto',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #ddd',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Firebase Auth / DB Debug</h2>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Status:</strong> {loading ? 'Checking session…' : isAuthed ? 'Signed in' : 'Signed out'}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {!isAuthed && (
          <button
            onClick={signInWithGoogle}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            Sign in with Google
          </button>
        )}

        {isAuthed && (
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #f0a',
              background: '#ffe6f2',
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            Logout
          </button>
        )}

        {isAuthed && (
          <>
            <button
              onClick={writeTestDoc}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              Write test doc
            </button>
            <button
              onClick={readTestDoc}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              Read test doc
            </button>
          </>
        )}
      </div>

      {authError && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: '#ffe6e6',
            color: '#a00',
            fontSize: '0.9rem',
          }}
        >
          <strong>Auth error:</strong> {authError}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <strong>User:</strong>
        <pre
          style={{
            marginTop: '0.5rem',
            background: '#f7f7f7',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            overflowX: 'auto',
          }}
        >
          {user
            ? JSON.stringify(
                {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                },
                null,
                2,
              )
            : 'null'}
        </pre>
      </div>

      <div>
        <strong>DB result:</strong>
        <pre
          style={{
            marginTop: '0.5rem',
            background: '#f7f7f7',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(dbResult, null, 2)}
        </pre>
      </div>
    </div>
  );
}
