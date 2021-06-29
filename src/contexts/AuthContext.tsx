import React from 'react';
import { firebase, auth } from '../services/firebase';

export const AuthContext = React.createContext({} as AuthProviderData);

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = {
  name: string;
  avatar: string;
  id: string;
};

type AuthProviderData = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User>();

  function fillUserWithAuthResult(user: firebase.User | null) {
    if (!user) return;

    const { displayName, photoURL, uid } = user;
    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account.');
    }
    setUser({ name: displayName, avatar: photoURL, id: uid });
  }

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
    fillUserWithAuthResult(user);
  }

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) =>
      fillUserWithAuthResult(user),
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
