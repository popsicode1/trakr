
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSJ64TQ9mEOWTHanelVCjUq0pNLaRVqmE",
  authDomain: "trakr-b142c.firebaseapp.com",
  projectId: "trakr-b142c",
  storageBucket: "trakr-b142c.firebasestorage.app",
  messagingSenderId: "969025914338",
  appId: "1:969025914338:web:8b91f67251a1da21b865bb",
  measurementId: "G-LP6KFWDH3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const createUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Add user to firestore
    await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Database functions
export const addTransaction = async (transaction: any) => {
  try {
    const docRef = await addDoc(collection(db, "transactions"), {
      ...transaction,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error };
  }
};

export const getTransactions = async () => {
  try {
    const q = query(
      collection(db, "transactions"), 
      where("userId", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(doc.data().createdAt?.seconds * 1000) || new Date()
    }));
    return { success: true, transactions };
  } catch (error) {
    console.error("Error getting transactions:", error);
    return { success: false, error, transactions: [] };
  }
};

export const updateWallet = async (walletId: string, newBalance: number) => {
  try {
    const q = query(
      collection(db, "wallets"), 
      where("id", "==", walletId),
      where("userId", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const walletDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "wallets", walletDoc.id), {
        balance: newBalance
      });
      return { success: true };
    }
    return { success: false, error: "Wallet not found" };
  } catch (error) {
    console.error("Error updating wallet:", error);
    return { success: false, error };
  }
};

export const getWallets = async () => {
  try {
    const q = query(
      collection(db, "wallets"), 
      where("userId", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    const wallets = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    }));
    
    // If no wallets found, create default wallets
    if (wallets.length === 0 && auth.currentUser) {
      const defaultWallets = [
        {
          id: 'cash',
          name: 'Cash',
          balance: 500,
          currency: 'PHP',
          color: '#38A169',
          isDefault: true,
          userId: auth.currentUser.uid,
          createdAt: new Date()
        },
        {
          id: 'bank',
          name: 'Bank Account',
          balance: 2500,
          currency: 'PHP',
          color: '#3182CE',
          userId: auth.currentUser.uid,
          createdAt: new Date()
        }
      ];
      
      for (const wallet of defaultWallets) {
        await addDoc(collection(db, "wallets"), wallet);
      }
      
      return { success: true, wallets: defaultWallets };
    }
    
    return { success: true, wallets };
  } catch (error) {
    console.error("Error getting wallets:", error);
    return { success: false, error, wallets: [] };
  }
};

// Export Firebase instances
export { app, analytics, auth, db };
