const useAuth = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  return {
    user,
    loading: false,
    isAuthenticated: !!token,
  };
};

export default useAuth;