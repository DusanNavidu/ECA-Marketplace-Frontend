export const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    
    return { 
      email: decoded.sub, 
      role: decoded.role 
    };
  } catch (error) {
    return null;
  }
};