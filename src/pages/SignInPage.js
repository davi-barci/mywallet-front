import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useContext, useEffect, useState } from "react";
import UsuarioLogadoContext from "../contexts/UsuarioLogado";
import axios from "axios";

export default function SignInPage() {
  const [formLogin, setFormLogin] = useState({email:"", senha:""});
  const {usuario, setUsuario} = useContext(UsuarioLogadoContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(usuario !== null){
        navigate("/home");
    }
  }, []);

  function handleForm(e){
      setFormLogin({...formLogin, [e.target.name]: e.target.value});
  }

  function realizarLogin(e){
      e.preventDefault();

      axios
      .post(`${process.env.REACT_APP_API_URL}/`, formLogin)
      .then(res => {
          localStorage.setItem("usuario", JSON.stringify({
              usuario: res.data.nomeUsuario,
              token: res.data.token
          }));
          setUsuario({usuario: res.data.nomeUsuario, token: res.data.token});
          navigate("/home");
      })
      .catch(err => {
          console.log(err);
          if (err.response.status === 404){
            alert("E-mail não cadastrado!"); 
          } else if (err.response.status === 422){
            alert("E-mail não está em um formato válido!");   
          } else if (err.response.status === 401){
            alert("Senha incorreta!");  
          }else{
            alert("Ocorreu algum erro durante a requisição, tente novamente...")
          }
      });
  }

  return (
    <SingInContainer>
      <form onSubmit={realizarLogin}>
        <MyWalletLogo />
        <input 
          placeholder="E-mail" 
          type="email" 
          name="email"
          value={formLogin.email}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="Senha" 
          type="password" 
          autoComplete="new-password"
          name="senha"
          value={formLogin.password}
          onChange={handleForm}
          required 
        />
        <button type="submit">Entrar</button>
      </form>

      <Link to={"/cadastro"}>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
