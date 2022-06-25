import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components';
import axiosInstance, { ApiError } from '../api';
import Divider from '../components/Divider';
import UrlInput from '../components/UrlInput';

const FullScreenContainer = styled(Container)`
    height: 100%;
    background-color: #2f6b4d;
`;

const ContainerCard = styled(Card)`
    max-width: 700px;
`;

const Title = styled.h1`
    color: white;
    text-align: center;
    font-size: 50px;
    font-size: 6vw;
`;

interface CreateGameData {
    id: number;
    uuid: string;
    createdAt: string;
    updatedAt: string;
}

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [gameUuid, setGameUuid] = useState<string>('');

    const handleCreateGame = async () => {
        try {
            const { data } = await axiosInstance.post<CreateGameData>('/games');
            navigate(`games/${data.uuid}`);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const error = err.toJSON() as ApiError;
                setErrorMessage(error.message);
                return;
            }

            setErrorMessage('An unexpected error has accurred');
        }
    }

    const handleCloseAlert = () => {
        setErrorMessage('');
    }

    const handleGameUuidChange = (e: React.FormEvent<HTMLInputElement>) => {
        setGameUuid(e.currentTarget.value);
    }

    return (
        <FullScreenContainer fluid>
            <Row className='justify-content-center align-items-center h-100'>
                <ContainerCard bg='dark'>
                    <Card.Body className='d-grid pb-5'>
                        <Title>Cards Game</Title>
                    
                        <Button 
                            variant='success' 
                            size='lg'
                            onClick={handleCreateGame}
                        >
                            Create a game
                        </Button>

                        <Alert
                            variant='danger'
                            dismissible
                            onClose={handleCloseAlert}
                            show={errorMessage !== ''}
                        >
                            {errorMessage}
                        </Alert>

                        <Divider color='rgba(255, 255, 255, .3)' />

                        <UrlInput 
                            id='game-url'
                            label='GameURL'
                            labelClassname='text-white'
                            urlPrefix='http://localhost:3000/'
                            value={gameUuid}
                            onChange={handleGameUuidChange}
                        />

                        <Button
                            variant='primary'
                            size='lg'
                            onClick={handleCreateGame}
                        >
                            Join game
                        </Button>
                    </Card.Body>
                </ContainerCard>
            </Row>
        </FullScreenContainer>
    );
}

export default Home;
