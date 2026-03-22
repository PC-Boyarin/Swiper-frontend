import {type SetStateAction, useState} from 'react';
import { SpaceBackground } from './SpaceBackground';
import {createUser, loginUser} from "../api/user.ts";

interface LoginRegisterProps {
  onLogin: () => void;
  setUserId: React.Dispatch<SetStateAction<number | null>>;
}

export function LoginRegister({ onLogin, setUserId }: LoginRegisterProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   try {
     e.preventDefault();

     if(e?.currentTarget) {
       const formData = new FormData(e.currentTarget);

       const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
       const testString = String(formData.get('email'))

       if(formData) {
         const body = {
           [emailRegex.test(testString) ? 'mail' : 'username']: formData.get('email'),
           password: formData.get('password'),
       }

         if (username && !isLogin) {
           body.username = username;
         }

         const response = isLogin ? await loginUser(body) : await createUser(body)

         if(response?.data?.id) {
           setUserId(response?.data?.id)
         }

         if (!isLogin && response) {
           setIsLogin(true);
         }

         if (response && isLogin ) {
           return onLogin();
         }
       }
     }
   } catch (err) {
     console.error(err);
   }
  };


  return (
    <div className="min-h-screen bg-[#5865f2] flex items-center justify-center p-4 relative overflow-hidden">
      <SpaceBackground />
      <div className="w-full max-w-md bg-[#36393f] rounded-lg shadow-2xl p-8 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-center mb-2">
          {isLogin ? 'С возвращением!' : 'Создать аккаунт'}
        </h1>
        <p className="text-[#b9bbbe] text-center mb-6 text-sm">
          {isLogin ? 'Мы так рады видеть вас снова!' : 'Присоединяйтесь к нашему сообществу'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[#b9bbbe] text-xs uppercase mb-2">
              Email / Login
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#202225] text-white rounded border-none focus:outline-none"
              required
              name="email"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[#b9bbbe] text-xs uppercase mb-2">
                Имя пользователя
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#202225] text-white rounded border-none focus:outline-none"
                required={!isLogin}
                name="username"
              />
            </div>
          )}

          <div>
            <label className="block text-[#b9bbbe] text-xs uppercase mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#202225] text-white rounded border-none focus:outline-none"
              required
              name="password"
            />
          </div>

          {isLogin && (
            <div className="text-sm">
              <a href="#" className="text-[#00aff4] hover:underline">
                Забыли пароль?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded transition-colors"
          >
            {isLogin ? 'Войти' : 'Продолжить'}
          </button>

          <div className="text-sm text-[#b9bbbe]">
            {isLogin ? (
              <>
                Нужен аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#00aff4] hover:underline"
                >
                  Зарегистрироваться
                </button>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#00aff4] hover:underline"
                >
                  Войти
                </button>
              </>
            )}
          </div>
        </form>

        {/* QR Code Option */}
        {isLogin && (
          <div className="mt-8 pt-6 border-t border-[#4e5058]">
            <div className="flex items-center justify-center gap-4">
              <div className="w-40 h-40 bg-white rounded p-2 flex items-center justify-center">
                <div className="w-full h-full bg-[#202225] rounded flex items-center justify-center">
                  <span className="text-white text-xs">QR код</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-2">Вход по QR-коду</h3>
                <p className="text-[#b9bbbe] text-sm">
                  Отсканируйте с помощью мобильного приложения Discord
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
