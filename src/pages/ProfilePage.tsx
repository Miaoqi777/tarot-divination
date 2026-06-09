import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Key, User } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const AVATARS = ['🌟', '🔮', '🌙', '⭐', '💫', '✨', '🦋', '🌸', '🎭', '🌺', '🍀', '💎'];

export default function ProfilePage() {
  const { isLoggedIn, user, login, register, logout, updateProfile, storedPassword } = useUserStore();
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleSubmit = () => {
    setError('');
    if (!nickname.trim() || !password.trim()) {
      setError('请填写昵称和密码');
      return;
    }
    if (isRegistering) {
      register(nickname.trim(), password.trim());
    } else {
      const success = login(nickname.trim(), password.trim());
      if (!success) setError('昵称或密码不正确');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center" style={{ height: '80vh' }}>
        <GlassCard className="p-8 w-full max-w-sm">
          <div className="flex flex-col items-center gap-4">
            <span style={{ fontSize: 48 }}>🔮</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
              {isRegistering ? '注册账号' : '登录'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
              登录后可以保存你的占卜历史和心情记录
            </p>

            <div className="w-full flex flex-col gap-3">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="昵称"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="密码"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none text-sm"
                  style={{
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              {error && <span style={{ fontSize: 12, color: '#C06060' }}>{error}</span>}
              <Button onClick={handleSubmit}>
                {isRegistering ? '注册' : '登录'}
              </Button>
            </div>

            <button
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="text-sm underline cursor-pointer"
              style={{ color: 'var(--text-secondary)', background: 'none', border: 'none' }}
            >
              {isRegistering ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-2 pb-20" style={{ maxWidth: 500, margin: '0 auto' }}>
      <GlassCard className="p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <motion.button
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="flex items-center justify-center rounded-full cursor-pointer"
            style={{
              width: 80, height: 80,
              background: 'var(--glass-bg)',
              border: '2px solid var(--glass-border-strong)',
              fontSize: 40,
            }}
            whileHover={{ scale: 1.05 }}
          >
            {user?.avatar || '🌟'}
          </motion.button>

          {/* Avatar picker */}
          {showAvatarPicker && (
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => { updateProfile({ avatar: a }); setShowAvatarPicker(false); }}
                  className="p-2 rounded-xl cursor-pointer"
                  style={{
                    fontSize: 24,
                    background: user?.avatar === a ? 'var(--glass-bg-strong)' : 'transparent',
                    border: user?.avatar === a ? '1px solid var(--glass-border-strong)' : '1px solid transparent',
                  }}
                >
                  {a}
                </button>
              ))}
            </motion.div>
          )}

          <div className="text-center">
            <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.nickname}
            </h3>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              注册于 {user ? new Date(user.createdAt).toLocaleDateString('zh-CN') : ''}
            </span>
          </div>

          <Button onClick={handleLogout} variant="secondary" size="sm">
            <LogOut size={16} />
            <span style={{ marginLeft: 6 }}>退出登录</span>
          </Button>
        </div>
      </GlassCard>

      {/* Stats */}
      <GlassCard className="p-5">
        <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>个人数据</h4>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          你的占卜历史和心情记录都安全地保存在本地浏览器中。
        </p>
      </GlassCard>
    </div>
  );
}
