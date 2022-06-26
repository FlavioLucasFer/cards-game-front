import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api';
import AddPlayerToGame from '../modals/AddPlayerToGame';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Divider from '../components/Divider';
import { Button, Tab, Tabs, ToastContainer, ToggleButton } from 'react-bootstrap';
import Toast from '../components/Toast';

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

interface ToastInfo {
    title: string;
    message: string;
    bg: string;
}

const Game: React.FC = () => {
    const navigate = useNavigate();
    const { uuid } = useParams<string>();
    const player = useSelector((state: RootState) => state.player);

    const [game, setGame] = useState<GameData>();
    const [autoShuffle, setAutoShuffle] = useState<boolean>(false);
    const [showAddPlayerModal, setShowAddPlayerModel] = useState<boolean>(!player.id);
    const [toastStack, setToastStack] = useState<ToastInfo[]>([]);

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

    const dealCard = async () => {
        const toastTitle = 'Deal card';

        try {
            await axiosInstance.post(`/games/${uuid}/deal-cards`, {
                player_id: player.id,
            });

            pushToast(
                toastTitle,
                'Card successfully dealt.',
                'success',
            );
        } catch (err) {
            pushToast(
                toastTitle,
                'An unexpected error has occurred. No card was not dealt.',
                'danger',
            );
        }
    }

    const shuffle = async () => {
        const toastTitle = 'Shuffle';

        try {
            await axiosInstance.post(`/games/${uuid}/shuffle`);

            pushToast(
                toastTitle,
                'The game deck was successfully shuffled.',
                'success',
            );
        } catch (err) {
            pushToast(
                toastTitle,
                'An unexpected error has occurred. Game deck was not shuffed.',
                'danger',
            );
        }
    }

    const addDeck = async () => {
        const toastTitle = 'Add deck';
        let toastMessage = 'Deck successfully added to the game deck';

        try {
            const { data: deck } = await axiosInstance.post<DeckData>('/decks');
            await axiosInstance.post(`/games/${uuid}/decks`, {
                deckId: deck.id,
            }); 
        } catch (err) {
            pushToast(
                toastTitle,
                'An unexpected error has occurred. Deck was not added.',
                'danger',
            );
            return;
        }

        if (autoShuffle) {
            try {
                await axiosInstance.post(`/games/${uuid}/shuffle`);
                toastMessage += ' and shuffled';
            } catch (err) {
                pushToast(
                    toastTitle,
                    'The deck has been added but, for some unexpected reason, it cannot be shuffled. Please, try to shuffle by clicking on the shuffle button.',
                    'warning',
                );

                return;
            }
        }

        pushToast(
            toastTitle,
            `${toastMessage}.`,
            'success',
        );
    }

    const handlePlayerJoin = () => {
        setShowAddPlayerModel(false);
    }

    const handleCheckAutoShuffle = () => {
        setAutoShuffle(!autoShuffle);
    }

    const pushToast = (title: string, message: string = '', bg: string = 'light') => {
        setToastStack((stack) => Object.assign([], { 
            ...stack, 
            [stack.length+1]: {
                title,
                message,
                bg,
            }, 
        }));
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
                                        <Button onClick={dealCard}>
                                            Deal card
                                        </Button>
                                    </Col>

                                    <Col className='d-flex flex-row-reverse'>
                                        <Button 
                                            variant='warning'
                                            onClick={shuffle}
                                        >
                                            Shuffle
                                        </Button>

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

                        <Row className='position-relative'>
                            <ToastContainer position='top-end'>
                                {toastStack.map((info: ToastInfo, index: number) => (
                                    <Toast
                                        key={`${info.title}-${index}`}
                                        title={info.title}
                                        message={info.message}
                                        bg={info.bg}
                                    />
                                ))}
                            </ToastContainer>

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
