const AuthHandler = { signOut: null };

export const registerSignOut = (handler) => {
  AuthHandler.signOut = handler;
};


export default AuthHandler;