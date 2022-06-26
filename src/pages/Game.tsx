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
import Divider from '../components/Divider';
import { Button, Stack, Tab, Tabs, ToggleButton } from 'react-bootstrap';
import axios from 'axios';

const FullScreenContainer = styled(Container)`
    height: 100%;
    background-color: #2f6b4d;
`;

const HeaderRow = styled(Row)`
    padding: 5px;
`;

const HeaderContent = styled.div`
    background-color: rgba(0, 0, 0, .3);
    border-radius: 5px;
    padding: 15px;
    color: white;
`;

const HeaderDivider = styled(Divider)`
    border-radius: 50%;
`;

const GameInfoP = styled.p`
    margin-bottom: 0;
`;

interface GameData {
    id: number;
    uuid: string;
    createdAt: string;
    updatedAt: string;
}

interface DeckData {
    id: number;
    createdAt: string;
    updatedAt: string;
}

const Game: React.FC = () => {
    const navigate = useNavigate();
    const { uuid } = useParams<string>();
    const player = useSelector((state: RootState) => state.player);

    const [game, setGame] = useState<GameData>();
    const [autoShuffle, setAutoShuffle] = useState<boolean>(false);
    const [showAddPlayerModal, setShowAddPlayerModel] = useState<boolean>(!player.id);

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

    const shuffle = async () => {
        try {
            await axiosInstance.post(`/games/${uuid}/shuffle`);
        } catch (err) {
            console.log('err');
        }
    }

    const addDeck = async () => {
        try {
            const { data: deck } = await axiosInstance.post<DeckData>('/decks');
            await axiosInstance.post(`/games/${uuid}/decks`, {
                deckId: deck.id,
            }); 

            if (autoShuffle)
                await shuffle();
        } catch (err) {
            console.log('err');
        }
    }

    const handlePlayerJoin = () => {
        setShowAddPlayerModel(false);
    }

    const handleCheckAutoShuffle = () => {
        setAutoShuffle(!autoShuffle);
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
                                <Row>
                                    <GameInfoP>
                                        <strong>Game ID: </strong>{uuid}
                                        <br/>
                                        <strong>Game URL: </strong>http://localhost:3000/games/{uuid}
                                    </GameInfoP>
                                </Row>

                                <HeaderDivider 
                                    color='#2f6b4d' 
                                    margin='10px 10px'
                                />

                                <Row>
                                    <Col>
                                        <Button>Deal card</Button>
                                    </Col>

                                    <Col className='d-flex flex-row-reverse'>
                                        <Button variant='warning'>Shuffle</Button>

                                        <Divider 
                                            direction='vertical'
                                            color='#2f6b4d'
                                            margin='18px 10px'
                                        />

                                        <Button 
                                            variant='success'
                                            onClick={addDeck}
                                        >
                                            Add deck
                                        </Button>

                                        <Divider 
                                            direction='vertical'
                                            color='#2f6b4d'
                                            margin='18px 10px'
                                        />

                                        <ToggleButton
                                            id='toggle-check'
                                            type='checkbox'
                                            variant='outline-warning'
                                            checked={autoShuffle}
                                            value='1'
                                            onChange={handleCheckAutoShuffle}
                                            title='Auto shuffle the game deck when adding a new deck'
                                        >
                                            Auto shuffle
                                        </ToggleButton>
                                    </Col>
                                </Row>
                            </HeaderContent>
                        </HeaderRow>

                        <Row>
                            <h2>Your hand ({player.nickname})</h2>
                            
                        </Row>
                    </Col>

                    <Col 
                        className='h-100 bg-dark pt-2' 
                        sm={12} 
                        md={4} 
                    >
                        <Tabs
                            defaultActiveKey='players'
                            id='game-info'
                            mountOnEnter
                            unmountOnExit
                        >
                            <Tab 
                                eventKey='players' 
                                title='Players'
                            >
                                <h3>players tab</h3>
                            </Tab>
                            <Tab 
                                eventKey='undealt-suits' 
                                title='Undealt suits'
                            >
                                <h3>undealt suits tab</h3>
                            </Tab>
                            <Tab 
                                eventKey='undealt-cards' 
                                title='Undealt cards'
                            >
                                <h3>undealt cards tab</h3>
                            </Tab>
                        </Tabs>
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
