export default function authHeader() {
  const jwt_token = JSON.parse(localStorage.getItem('jwt_token'));
  if (jwt_token) {
    return {
      Authorization: 'Bearer ' + jwt_token
    };
  } else {
    return {};
  }
}