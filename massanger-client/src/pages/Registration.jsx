import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const navigate = useNavigate();
  // Состояния для полей формы
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Состояния для UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem('isAuth') === 'true'){
      navigate('/choice')
    }
  },[navigate])
  

  const validateForm = () => {
    if (!username.trim() || !password) {
      setError('Пожалуйста, заполните все поля');
      return false;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return false;
    }
    return true;
  };

  const handleAuthSuccess = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    setSuccess(true);
    setUsername('');
    setPassword('');
    navigate('/choice');
  };

  // Регистрация
  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        username: username,
        password: password
      });
      handleAuthSuccess(response.data?.token);
      localStorage.setItem('userid', response.data.user.id)
      localStorage.setItem('isAuth', true)
      localStorage.setItem('Uname', username)
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  }

  // Вход
  async function handleLogin(e) {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        username: username,
        password: password
      });
      handleAuthSuccess(response.data?.token);
      localStorage.setItem('userid', response.data.user.id)
      localStorage.setItem('isAuth', true)
      localStorage.setItem('Uname', username)
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Форма обрабатывает регистрацию по умолчанию через Enter */}
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Авторизация / Регистрация</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>Успешно! Пожалуйста, подождите...</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Логин (Email или Имя)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Введите логин"
            disabled={isLoading}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Пароль</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.inputPassword}
              placeholder="Введите или придумайте пароль"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              disabled={isLoading}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {/* Кнопка регистрации отправляет форму onSubmit */}
        <button type="submit" style={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
        
        {/* Кнопка входа имеет type="button" и вызывает свою функцию */}
        <button type="button" onClick={handleLogin} style={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    margin: '0 0 20px 0',
    textAlign: 'center',
    color: '#333333',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666666',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPassword: {
    width: '100%',
    padding: '10px',
    paddingRight: '40px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '14px',
    border: '1px solid #f5c6cb',
  },
  success: {
    color: '#155724',
    backgroundColor: '#d4edda',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    fontSize: '14px',
    border: '1px solid #c3e6cb',
  },
};