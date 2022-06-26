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
import { Button, Stack, Tab, Tabs, ToastContainer, ToggleButton } from 'react-bootstrap';
import Toast from '../components/Toast';
import PlayingCard from '../components/PlayingCard';
import moment from 'moment';

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

const MainCol = styled(Col)`
    @media(max-width: 768px) {
        height: 730px !important;
    }
`;

const GameInfoP = styled.p`
    margin-bottom: 0;
`;

const PlayingCardsRow = styled(Row)`
    overflow-y: auto;
    height: 660px;

    @media(max-width: 1440px) {
        height: 570px;
    }

    @media(max-width: 1024px) {
        height: 550px;
    }

    @media(max-width: 768px) {
        height: 530px;
    }

    @media(max-width: 425px) {
        height: 470px;
    }
`;

const UndealtPlayingCardsRow = styled(Row)`
    overflow-y: auto;
    height: 810px;

    @media(max-width: 1440px) {
        height: 720px;
    }

    @media(max-width: 1024px) {
        height: 680px;
    }
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

interface PlayingCardData {
    id: number;
    deckId: number,
    playerId: number,
    face: string,
    suit: string,
    index: number,
    faceValue: number,
    dealt: boolean,
    createdAt: string;
    updatedAt: string;
}

interface PlayerData {
    id: number;
    gameId: number;
    nickname: string;
    handValue: number;
    createdAt: string;
    updatedAt: string;
};

interface UndealtSuitsData {
    hearts: number;
    spades: number;
    clubs: number;
    diamonds: number;
}

interface UndealtPlayingCardsData {
    face: string;
    suit: string;
    faceValue: number;
    remaining: number;
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
    const [playingCards, setPlayingCards] = useState<PlayingCardData[]>([]);
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [undealtSuits, setUndealtSuits] = useState<UndealtSuitsData>({
        hearts: 0,
        spades: 0,
        clubs: 0,
        diamonds: 0,
    });
    const [undealtPlayingCards, setUndealtPlayingCards] = useState<UndealtPlayingCardsData[]>([]);

    const [autoShuffle, setAutoShuffle] = useState<boolean>(false);
    const [showAddPlayerModal, setShowAddPlayerModel] = useState<boolean>(!player.id);
    const [toastStack, setToastStack] = useState<ToastInfo[]>([]);

    useEffect(() => {
        if (player.id)
            initialFetch();
    }, [uuid, player.id]);

    const initialFetch = async () => {
        await Promise.all([
            getGame(),
            getCards(),
            getPlayers(),
            getUndealtSuits(),
            getUndealtPlayingCards(),
        ]);
    }

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

    const getCards = async () => {
        try {
            const { data } = await axiosInstance.get<PlayingCardData[]>(`/players/${player.id}/cards`);
            setPlayingCards(data);
        } catch (err) {
            console.log('err:', err);
            navigate('/');
        }
    }

    const getPlayers = async () => {
        try {
            const { data } = await axiosInstance.get<PlayerData[]>(`/games/${uuid}/players`);
            setPlayers(data);
        } catch (err) {
            console.log('err:', err);
            navigate('/');
        }
    }

    const getUndealtSuits = async () => {
        try {
            const { data } = await axiosInstance.get<UndealtSuitsData>(`/games/${uuid}/undealt-suits`);
            setUndealtSuits(data);
        } catch (err) {
            console.log('err:', err);
            navigate('/');
        }
    }

    const getUndealtPlayingCards = async () => {
        try {
            const { data } = await axiosInstance.get<UndealtPlayingCardsData[]>(`/games/${uuid}/undealt-cards`);
            setUndealtPlayingCards(data);
        } catch (err) {
            console.log('err:', err);
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

        await getCards();
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
                    <MainCol
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
                                    <small>
                                        <em>
                                            <b>Created at: </b>
                                            {moment(game?.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                                        </em>
                                    </small>
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
                            
                            <PlayingCardsRow>
                                {player.id ? 
                                    playingCards.map((card: PlayingCardData, index: number) => (
                                        <PlayingCard 
                                            key={`${card.face}-${card.suit}-${index}`}
                                            face={card.face}
                                            suit={card.suit}
                                        />
                                    ))
                                : <></>}
                            </PlayingCardsRow>
                        </Row>
                    </MainCol>

                    <Col 
                        className='h-100 bg-dark pt-2' 
                        sm={12} 
                        md={4} 
                    >
                        <Tabs
                            defaultActiveKey='players'
                            id='game-info'
                        >
                            <Tab 
                                eventKey='players' 
                                title='Players'
                                className='p-3'
                            >
                                {players.map((p: PlayerData, index: number) => {
                                    let className = 'text-danger';

                                    if (index === 0) {
                                        className = 'text-success fs-5';
                                    }
                                    else if (index > 0 && index < 6)
                                        className = 'text-warning';

                                    if (p.id === player.id)
                                        className += ' fw-bold';

                                    return (
                                        <p 
                                            key={`${p.nickname}-${p.id}`}
                                            className={className}
                                        >
                                            {index === 0 && '👑 '} 
                                            {index+1} - {p.id === player.id && '(you) '} 
                                            {p.nickname} ({p.handValue})
                                        </p>
                                    );
                                })}
                            </Tab>
                            <Tab 
                                eventKey='undealt-suits' 
                                title='Undealt suits'
                                className='p-3 text-white fs-5'
                            >
                                <p>♥ Hearts: {undealtSuits.hearts}</p>
                                <p>♠ Spades: {undealtSuits.spades}</p>
                                <p>♣ Clubs: {undealtSuits.clubs}</p>
                                <p>♦ Diamonds: {undealtSuits.diamonds}</p>
                            </Tab>
                            <Tab 
                                eventKey='undealt-cards' 
                                title='Undealt cards'
                                className='p-3'
                            >
                                <UndealtPlayingCardsRow>
                                    {undealtPlayingCards.map((card: UndealtPlayingCardsData) => (
                                        <PlayingCard 
                                            key={`${card.face}-${card.suit}-${card.faceValue}-${card.remaining}`}
                                            face={card.face}
                                            suit={card.suit}
                                            info={card.remaining}
                                            infoTitle={`Ramaining ${card.remaining} ${card.face} of ${card.suit.toLowerCase()}`}
                                        />
                                    ))}
                                </UndealtPlayingCardsRow>
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
