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
          value={formCadastro.senha}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="Confirme a senha" 
          type="password" 
          autoComplete="new-password" 
          name="confirmacaoSenha"
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
