import { BrowserRouter, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TransactionsPage from "./pages/TransactionPage";
import UsuarioLogadoContext from "./contexts/UsuarioLogado";
import { useState } from "react";

export default function App() {

  const [usuario, setUsuario] = useState((localStorage.getItem("usuario")) ? (JSON.parse(localStorage.getItem("usuario"))) : null);

  return (
    <PagesContainer>
      <BrowserRouter>
        <UsuarioLogadoContext.Provider value={{usuario, setUsuario}}>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/cadastro" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/nova-transacao/:tipo" element={<TransactionsPage />} />
          </Routes>
        </UsuarioLogadoContext.Provider>
      </BrowserRouter>
    </PagesContainer>
  )
}

const PagesContainer = styled.main`
  background-color: #8c11be;
  width: calc(100vw - 50px);
  max-height: 100vh;
  padding: 25px;
`
