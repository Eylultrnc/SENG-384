import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Fonksiyonun adı tam olarak 'App' olmalı
function App() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

const API_URL = 'http://localhost:3000/api/people';
  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await axios.get(API_URL);
      setPeople(res.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { full_name: name, email });
      setName('');
      setEmail('');
      fetchPeople();
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || "Kayıt yapılamadı"));
    }
  };

  const deletePerson = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPeople();
      } catch (err) {
        console.error("Silme hatası:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Kişi Yönetim Sistemi</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="İsim" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Kaydet</button>
      </form>
      <hr />
      <ul>
        {people.map(p => (
          <li key={p.id}>
            {p.full_name} - {p.email} 
            <button onClick={() => deletePerson(p.id)} style={{marginLeft: '10px', color: 'red'}}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 2. BU SATIRIN OLDUĞUNDAN EMİN OL (Hata muhtemelen burada)
export default App;