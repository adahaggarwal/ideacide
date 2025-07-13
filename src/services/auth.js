import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

// Create account with email and password
export const createAccount = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, {
      displayName: displayName
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Google sign in with redirect (CORS-safe)
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Set custom parameters for better UX
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Set a flag to indicate we're doing a Google sign-in redirect
    sessionStorage.setItem('google-signin-redirect', 'true');
    
    // Use redirect instead of popup to avoid CORS issues
    await signInWithRedirect(auth, provider);
    
    // Note: The redirect result will be handled by handleRedirectResult
    // This function will redirect the page, so no return value
  } catch (error) {
    // Clear the flag if there's an error
    sessionStorage.removeItem('google-signin-redirect');
    throw error;
  }
};

// Handle redirect result after Google sign-in
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // User signed in successfully
      return result.user;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Get Firebase error message
export const getFirebaseErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'Email address is already in use.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    // Google Auth specific errors (redirect-based)
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google sign-in.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled. Please contact support.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.';
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with a different user account.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};
