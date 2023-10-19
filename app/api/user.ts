import { auth, db } from "@/lib/firebase";
import { Anime } from "@/types/anime";
import { ContinueWatching } from "@/types/user";

import { 
  GoogleAuthProvider,
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { 
  doc, 
  collection, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  getDoc, 
  updateDoc, 
  setDoc,
  orderBy,
  serverTimestamp, 
} from "firebase/firestore";

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await sendEmailVerification(user);
    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

export const checkWatchlist = async (userId: string, animeId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const watchlistCollection = collection(userDocRef, 'watchlist');
  const q = query(watchlistCollection, where('animeId', '==', animeId));
  const querySnapshot = await getDocs(q);
  
  return !querySnapshot.empty;
};

export const fetchWatchlist = async (userId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const watchlistCollection = collection(userDocRef, 'watchlist');
  const querySnapshot = await getDocs(watchlistCollection);

  return querySnapshot.docs.map(doc => doc.data() as Anime);
};

export const addToWatchlist = async (userId: string, animeId: string, animeTitle: string) => {
  const userDocRef = doc(db, 'users', userId);
  const watchlistCollection = collection(userDocRef, 'watchlist');

  const animeDocRef = doc(watchlistCollection, animeId);

  const animeDocSnapshot = await getDoc(animeDocRef);

  if (!animeDocSnapshot.exists()) {
    await setDoc(animeDocRef, {
      animeId: animeId,
      animeTitle: animeTitle,
    });
  }
};


export const removeFromWatchlist = async (userId: string, animeId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const watchlistCollection = collection(userDocRef, 'watchlist');
  
  const q = query(watchlistCollection, where('animeId', '==', animeId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const docToDelete = querySnapshot.docs[0];
    await deleteDoc(docToDelete.ref);
  }
};

export const addToContinueWatching = async (userId: string, animeId: string, animeTitle: string, episodeId: string, episodeTitle: string, url: string, currentTime: number) => {
  const userDocRef = doc(db, 'users', userId);
  const continueWatchingCollection = collection(userDocRef, 'continueWatching');

  const animeDocRef = doc(continueWatchingCollection, animeId);

  const animeDocSnapshot = await getDoc(animeDocRef);

  if (animeDocSnapshot.exists()) {
    await updateDoc(animeDocRef, {
      animeId: animeId,
      episodeId: episodeId,
      episodeTitle: episodeTitle,
      currentTime: currentTime,
      url: url,
      timestamp: serverTimestamp(),
    });
  } else {
    await setDoc(animeDocRef, {
      animeId: animeId,
      animeTitle: animeTitle,
      episodeId: episodeId,
      episodeTitle: episodeTitle,
      currentTime: currentTime,
      url: url,
      timestamp: serverTimestamp(),
    });
  }
};

export const fetchContinueWatching = async (userId: string): Promise<ContinueWatching[]> => {
  const userDocRef = doc(db, 'users', userId);
  const continueWatchingCollection = collection(userDocRef, 'continueWatching');

  const q = query(continueWatchingCollection, orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);

  const continueWatching: ContinueWatching[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as ContinueWatching;
    continueWatching.push(data);
  });

  return continueWatching;
};

export const loadContinueWatching = async (userId: string, animeId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const continueWatchingCollection = collection(userDocRef, 'continueWatching');

  const animeDocRef = doc(continueWatchingCollection, animeId);

  const animeDocSnapshot = await getDoc(animeDocRef);

  if (animeDocSnapshot.exists()) {
    const data = animeDocSnapshot.data();
    return data;
  }
};

export const removeFromContinueWatching = async (userId: string, animeId: string) => {
  const userDocRef = doc(db, 'users', userId);
  const continueWatchingCollection = collection(userDocRef, 'continueWatching');
  const animeDocRef = doc(continueWatchingCollection, animeId);

  await deleteDoc(animeDocRef);
};

