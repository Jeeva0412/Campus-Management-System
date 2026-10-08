const API_URL = 'http://localhost:8080/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Login failed');
  }
  return res.json();
}

export async function register(email: string, password: string, fullName: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name: fullName })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Registration failed');
  }
  return res.json();
}

export async function fetchClubs() {
  const res = await fetch(`${API_URL}/clubs/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch clubs');
  return res.json();
}

export async function createClub(name: string, description: string) {
  const res = await fetch(`${API_URL}/clubs/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, description })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create club');
  }
  return res.json();
}

export async function joinClub(clubId: number) {
  const res = await fetch(`${API_URL}/clubs/${clubId}/join`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to join club');
  }
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/events/`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function registerForEvent(eventId: number) {
  const res = await fetch(`${API_URL}/events/${eventId}/register`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to register for event');
  }
  return res.json();
}

export async function fetchMe() {
  const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function createEvent(clubId: number, title: string, description: string, startTime: string, capacity: number) {
  const res = await fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ club_id: clubId, title, description, start_time: startTime, capacity })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to create event');
  }
  return res.json();
}

export async function deleteEvent(eventId: number) {
  const res = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to delete event');
  }
  return res.json();
}

export async function fetchClubMembers(clubId: number) {
  const res = await fetch(`${API_URL}/clubs/${clubId}/members`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch club members');
  return res.json();
}

export async function kickClubMember(clubId: number, userId: number) {
  const res = await fetch(`${API_URL}/clubs/${clubId}/members/${userId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Failed to kick member');
  }
  return res.json();
}
