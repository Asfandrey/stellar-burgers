import { AppHeaderUI } from '@ui';

import { selectUser } from '../../services/selectors';
import { useSelector } from '../../services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);

  /* имя пользователя из хранилища */
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
