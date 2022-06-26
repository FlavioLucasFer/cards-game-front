import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api';
import AddPlayerToGame from '../modals/AddPlayerToGame';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const FullScreenContainer = styled(Container)`
    height: 100%;
    background-color: #2f6b4d;
`;

const HeaderRow = styled(Row)`
    height: 100px;
    padding: 5px;
`;

const HeaderContent = styled.div`
    background-color: rgba(0, 0, 0, .3);
    border-radius: 5px;
    padding: 5px;
    color: white;
`;

interface GameData {
    id: number;
    uuid: string;
    createdAt: string;
    updatedAt: string;
}

const Game: React.FC = () => {
    const navigate = useNavigate();
    const { uuid } = useParams<string>();
    const player = useSelector((state: RootState) => state.player);

    const [showAddPlayerModal, setShowAddPlayerModel] = useState<boolean>(!player.id);
    const [game, setGame] = useState<GameData>();

    useEffect(() => {
        getGame();
    }, [uuid]);

    const getGame = async () => {
        try {
            const { 
                data, 
                status 
            } = await axiosInstance.get<GameData>(`/games/${uuid}`);
            
            if (status === 204)
                navigate('/');

            setGame(data);

            if (player.gameId !== data.id)
                setShowAddPlayerModel(true);
        } catch (err) {
            navigate('/');
        }
    }

    const handlePlayerJoin = () => {
        setShowAddPlayerModel(false);
    }

    return (
        <>
            <FullScreenContainer fluid>
                <Row className='vh-100'>
                    <Col 
                        className='h-100'
                        sm={12}
                        md={8}
                    >
                        <HeaderRow>
                            <HeaderContent>
                                <p>
                                    <strong>Game ID: </strong>{uuid}
                                    <br/>
                                    <strong>Game URL: </strong>http://localhost:3000/games/{uuid}
                                </p>
                            </HeaderContent>
                        </HeaderRow>

                        <Row>
                            
                        </Row>
                    </Col>

                    <Col 
                        className='h-100 bg-dark' 
                        sm={12} 
                        md={4} 
                    >
                    </Col>
                </Row>
            </FullScreenContainer>

            <AddPlayerToGame 
                gameUuid={uuid || ''}
                show={showAddPlayerModal}
                onJoin={handlePlayerJoin}
            />
        </>
    );
}

export default Game;
