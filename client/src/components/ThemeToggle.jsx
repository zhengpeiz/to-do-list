export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark'; 

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      style={{
        padding: '8px 10px',
        borderRadius: 10,
        border: '1px solid var(--border)',
        background: 'var(--card)',
        color: 'var(--text)',
        cursor: 'pointer'
      }}
      aria-pressed={isDark}
      title="Toggle theme"
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}