import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const error = useSelector((state) => state.user.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(
      loginUser({
        email,
        password,
      })
    )
      .unwrap()
      .then(() => {
        // Вход успешен — возвращаем пользователя
        // на страницу, которую он хотел открыть.
        void navigate(from, { replace: true });
      })
      .catch(() => {
        // Ошибка уже сохраняется в Redux через loginUser.rejected.
      });
  };

  return (
    <LoginUI
      errorText={error?.message ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
