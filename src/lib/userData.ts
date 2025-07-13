export const getUserData = () => {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=').map((c) => c.trim());
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  const userData = JSON.parse(decodeURIComponent(cookies.User));
  const { id, email } = userData;
  return { id, email };
};
