import { useMemo } from "react";


const useAuth = () => {

  /*
  =====================================================
  READ TOKEN
  =====================================================
  */

  const token =
    localStorage.getItem(
      "token"
    );


  /*
  =====================================================
  READ USER SAFELY
  =====================================================
  */

  const storedUser =
    localStorage.getItem(
      "user"
    );


  let user = null;


  if (storedUser) {

    try {

      user =
        JSON.parse(
          storedUser
        );

    } catch (error) {

      console.error(
        "Invalid user data in localStorage:",
        error
      );

      localStorage.removeItem(
        "user"
      );

    }

  }


  /*
  =====================================================
  NORMALIZE USER ROLE
  =====================================================
  */

  if (user) {

    user = {
      ...user,

      role:
        String(
          user.role || ""
        )
          .trim()
          .toUpperCase(),
    };

  }


  /*
  =====================================================
  AUTHENTICATION
  =====================================================
  */

  const isAuthenticated =
    Boolean(
      token &&
      user
    );


  /*
  =====================================================
  RETURN
  =====================================================
  */

  return useMemo(
    () => ({
      user,

      loading: false,

      isAuthenticated,

      token,
    }),
    [
      token,
      user,
      isAuthenticated,
    ]
  );

};


export default useAuth;