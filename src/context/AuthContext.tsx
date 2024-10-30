"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import firebase_app from "@/firebase/config";
import Loader from "@/app/components/common/Loader";

const auth = getAuth(firebase_app);

interface AuthContextType {
  user: User | null;
  logOut: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  logOut: () => {},
  token: null
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const setTokenCookie = (token: string) => {
    document.cookie = `idToken=${token}; path=/; secure; HttpOnly`;
  };

  const logOut = async () => {
    await signOut(auth);
    setToken(null);
    document.cookie = `idToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const idToken = await user.getIdToken();
        setToken(idToken);
        setTokenCookie(idToken); // Устанавливаем куки
      } else {
        setUser(null);
        setToken(null);
        setTokenCookie(''); // Очистите куки
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, logOut, token }}>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
