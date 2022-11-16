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

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userState);

  return { user, setUser };
};
