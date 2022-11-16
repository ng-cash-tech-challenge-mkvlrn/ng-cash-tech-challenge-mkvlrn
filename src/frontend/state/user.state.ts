import { atom, useRecoilState } from 'recoil';

export interface UserState {
  id: string;
  username: string;
  accountId: string;
}

const userState = atom<UserState | null>({
  key: 'user',
  default: null,
});

const checkingAuthState = atom<boolean>({
  key: 'checkAuth',
  default: false,
});

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);
  const [checkingAuth, setCheckingAuth] = useRecoilState(checkingAuthState);

  return { user, setUser, checkingAuth, setCheckingAuth };
};
