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
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #8C11BE;

  form{
    width: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 36px;

    h1{
      width: 147px;
      height: 50px;
      line-height: 50px;
      color: #FFFFFF;
      margin-bottom: 24px;
    }

    input{
      width: 100%;
      height: 58px;
      background: #FFFFFF;
      border-radius: 5px;
      margin-bottom: 13px;
      box-sizing: border-box;
      font-size: 20px;
      outline: none;
      border: 1px solid #ccc;
      padding: 15px;
      :focus {
            border: 2px solid #ffb6b6;
      }
      ::placeholder{
        color: #000000;
      }
      font-family: 'Raleway';
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 23px;
      color: #000000;
    }

    button{
      width: 100%;
      height: 46px;
      background: #A328D6;
      border-radius: 5px;
      outline: none;
      border: none;
      font-family: 'Raleway';
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      cursor: pointer;
    }
  }

  a{
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 18px;
    color: #FFFFFF;
    text-decoration: none;
  }
`
