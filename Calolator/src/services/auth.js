import { auth, googleAuthProvider } from './firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Đăng ký người dùng
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Gửi email xác nhận
    await sendEmailVerification(user);

    return {
      success: true,
      message: 'Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.',
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Đăng nhập người dùng (chỉ cho phép nếu đã xác nhận email)
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      return {
        success: false,
        message: 'Vui lòng xác nhận email trước khi đăng nhập.',
      };
    }

    return { success: true, message: 'Đăng nhập thành công!', user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    console.log('Đăng nhập thành công:', result.user);
    return result.user;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('Đăng xuất thành công');
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
  }
};
