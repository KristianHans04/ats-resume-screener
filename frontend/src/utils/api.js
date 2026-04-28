const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('csas_access');
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to application/json if it's not a FormData instance
  // (FormData requires the browser to set the multipart boundary automatically)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, clear tokens (a real app would try to refresh here)
    localStorage.removeItem('csas_access');
    localStorage.removeItem('csas_refresh');
    localStorage.removeItem('csas_user');
    window.location.href = '/login';
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || 
                     data?.detail || 
                     (data?.non_field_errors && data.non_field_errors[0]) ||
                     (data && typeof data === 'object' && Object.values(data)[0]) ||
                     'An error occurred';
    throw new Error(errorMsg);
  }

  return data;
}
