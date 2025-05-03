import { auth, googleAuthProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

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

    await setDoc(doc(db, "users", user.uid), {
    }); 

    return {
      success: true,
      message: "Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.",
    };
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email đã được sử dụng. Vui lòng chọn email khác.",
      };
    }
    if (error.code === "auth/invalid-email") {
      return {
        success: false,
        message: "Email không hợp lệ. Vui lòng kiểm tra lại.",
      };
    }
    if (error.code === "auth/weak-password") {
      return {
        success: false,
        message: "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.",
      };
    }
    if (error.code === "auth/operation-not-allowed") {
      return {
        success: false,
        message: "Đăng ký không được phép. Vui lòng thử lại sau.",
      };
    }
    if (error.code === "auth/too-many-requests") {
      return {
        success: false,
        message: "Quá nhiều yêu cầu. Vui lòng thử lại sau.",
      };
    }
    if (error.code === "auth/operation-not-supported-in-this-environment") {
      return {
        success: false,
        message: "Đăng ký không được hỗ trợ trong môi trường này.",
      };
    }

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
        message: "Vui lòng xác nhận email trước khi đăng nhập.",
      };
    }

    return { success: true, message: "Đăng nhập thành công!", user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
      });
    }
    return result.user;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      console.error("Popup bị đóng bởi người dùng");
    }
    if (error.code === "auth/popup-blocked") {
      console.error("Popup bị chặn bởi trình duyệt");
    }
    if (error.code === "auth/operation-not-allowed") {
      console.error("Đăng nhập bằng Google không được phép");
    }
    if (error.code === "auth/operation-not-supported-in-this-environment") {
      console.error("Đăng nhập không được hỗ trợ trong môi trường này");
    }
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Đăng xuất thành công");
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  }
};
