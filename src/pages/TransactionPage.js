import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import UsuarioLogadoContext from "../contexts/UsuarioLogado";
import axios from "axios";

export default function TransactionsPage() {
  const {tipo} = useParams();
  const [formTransaction, setFormTransaction] = useState({valor:"", descricao:""});
  const {usuario} = useContext(UsuarioLogadoContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(usuario === null) return navigate("/");
  }, []);

  function handleForm(e){
    setFormTransaction({...formTransaction, [e.target.name]: e.target.value});
  }

  function realizarTransacao(e){
    e.preventDefault();

    const config = {
      headers: {
          Authorization: `Bearer ${usuario.token}`
      }
    };

    formTransaction.valor = Number(formTransaction.valor);

    axios
    .post(`${process.env.REACT_APP_API_URL}/nova-transacao/${tipo}`, formTransaction, config)
    .then(res => {
        alert("Transação realizada com sucesso!");
        navigate("/home");
    })
    .catch(err => {
        console.log(err);
        if (err.response.status === 422){
          alert("Dados Inválidos!"); 
        }else{
          alert("Ocorreu algum erro durante a requisição, tente novamente...");
        }
    });
  }

  return (
    <TransactionsContainer>
      <h1>Nova {tipo}</h1>
      <form onSubmit={realizarTransacao}>
        <input 
          placeholder="Valor" 
          type="number"
          name="valor"
          value={formTransaction.valor}
          onChange={handleForm}
          required
        />
        <input 
          placeholder="Descrição" 
          type="text" 
          name="descricao"
          value={formTransaction.descricao}
          onChange={handleForm}
          required
        />
        <button type="submit">Salvar {tipo}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: 100vh;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #8C11BE;

  h1 {
    align-self: flex-start;
    margin-top: 25px;
    margin-bottom: 40px;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 26px;
    line-height: 31px;
    color: #FFFFFF;
    margin-left: 25px;
  }

  form{
    width: calc(100% - 50px);
    display: flex;
    flex-direction: column;
    margin-left: 25px;

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
`
