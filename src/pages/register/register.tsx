import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { selectUserError } from '../../services/selectors';
import { registerUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectUserError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    )
      .unwrap()
      .then(() => {
        void navigate('/', { replace: true });
      })
      .catch(() => {
        // Ошибка регистрации уже сохранена в Redux через registerUser.rejected.
      });
  };

  return (
    <RegisterUI
      errorText={error?.message ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
