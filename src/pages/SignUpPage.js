import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import UsuarioLogadoContext from "../contexts/UsuarioLogado";

export default function SignUpPage() {
  const [formCadastro, setFormCadastro] = useState({email:"", senha:"", nome:"", confirmacaoSenha: ""});
  const {usuario} = useContext(UsuarioLogadoContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(usuario !== null){
        navigate("/home");
    }
  }, []);

  function handleForm(e){
      setFormCadastro({...formCadastro, [e.target.name]: e.target.value});
  }

  function finalizarCadastro(e){
      e.preventDefault();

      if (formCadastro.senha !== formCadastro.confirmacaoSenha){
        alert("As senhas digitadas não são iguais!");
        return;
      }

      delete formCadastro.confirmacaoSenha;
      
      axios      
      .post(`${process.env.REACT_APP_API_URL}/cadastro`, formCadastro)
      .then(res => navigate("/"))
      .catch(err => {
        console.log(err);
        if (err.response.status === 422){
          alert("E-mail inválido/Senha com menos de 3 caracteres");   
        } else if (err.response.status === 409){
          alert("Esse e-mail já foi cadastrado!");  
        }else{
          alert("Ocorreu algum erro durante a requisição, tente novamente...")
        }
      });
  }

  return (
    <SingUpContainer>
      <form onSubmit={finalizarCadastro}>
        <MyWalletLogo />
        <input 
          placeholder="Nome" 
          type="text" 
          name="nome"
          value={formCadastro.nome}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="E-mail" 
          type="email" 
          name="email"
          value={formCadastro.email}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="Senha" 
          type="password" 
          autoComplete="new-password" 
          name="senha"
          minLength="3"
          value={formCadastro.senha}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="Confirme a senha" 
          type="password" 
          autoComplete="new-password" 
          name="confirmacaoSenha"
          minLength="3"
          value={formCadastro.confirmacaoSenha}
          onChange={handleForm}
          required
        />
        <button type="submit">Cadastrar</button>
      </form>

      <Link to={"/"}>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
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
    margin-bottom: 32px;

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
