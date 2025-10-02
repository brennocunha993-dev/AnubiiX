// Configuração Firebase - AnubiiX
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Configuração do Firebase - AnubiiX
const firebaseConfig = {
  apiKey: "AIzaSyBgxOfNleCXDwMKauSxrvhfDt6w1-RBbdI",
  authDomain: "anubiix-fcdbf.firebaseapp.com",
  projectId: "anubiix-fcdbf",
  storageBucket: "anubiix-fcdbf.appspot.com",
  messagingSenderId: "136100464885",
  appId: "1:136100464885:web:0b99813053a34e3836ddbc"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar provedor Google
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Funções de autenticação
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Salvar dados do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
      lastLogin: new Date(),
      role: 'player'
    }, { merge: true });
    
    return user;
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro no logout:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};