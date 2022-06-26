import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';

const kings = new Map([
    ['spades', '🂮'],
    ['hearts', '🂾'],
    ['diamonds', '🃎'],
    ['clubs', '🃞'],
]);

const queens = new Map([
    ['spades', '🂭'],
    ['hearts', '🂽'],
    ['diamonds', '🃍'],
    ['clubs', '🃝'],
]);

const jacks = new Map([
    ['spades', '🂫'],
    ['hearts', '🂻'],
    ['diamonds', '🃋'],
    ['clubs', '🃛'],
]);

const tens = new Map([
    ['spades', '🂪'],
    ['hearts', '🂺'],
    ['diamonds', '🃊'],
    ['clubs', '🃚'],
]);

const nines = new Map([
    ['spades', '🂩'],
    ['hearts', '🂹'],
    ['diamonds', '🃉'],
    ['clubs', '🃙'],
]);

const eights = new Map([
    ['spades', '🂨'],
    ['hearts', '🂸'],
    ['diamonds', '🃈'],
    ['clubs', '🃘'],
]);

const sevens = new Map([
    ['spades', '🂧'],
    ['hearts', '🂷'],
    ['diamonds', '🃇'],
    ['clubs', '🃗'],
]);

const sixes = new Map([
    ['spades', '🂦'],
    ['hearts', '🂶'],
    ['diamonds', '🃆'],
    ['clubs', '🃖'],
]);

const fives = new Map([
    ['spades', '🂥'],
    ['hearts', '🂵'],
    ['diamonds', '🃅'],
    ['clubs', '🃕'],
]);

const fours = new Map([
    ['spades', '🂤'],
    ['hearts', '🂴'],
    ['diamonds', '🃄'],
    ['clubs', '🃔'],
]);

const threes = new Map([
    ['spades', '🂣'],
    ['hearts', '🂳'],
    ['diamonds', '🃃'],
    ['clubs', '🃓'],
]);

const twos = new Map([
    ['spades', '🂢'],
    ['hearts', '🂲'],
    ['diamonds', '🃂'],
    ['clubs', '🃒'],
]);

const aces = new Map([
    ['spades', '🂡'],
    ['hearts', '🂱'],
    ['diamonds', '🃁'],
    ['clubs', '🃑'],
]);

const getCard = (face: string, suit: string) => {
    switch (face) {
        case 'king':
            return kings.get(suit);
        case 'queen':
            return queens.get(suit);
        case 'jack':
            return jacks.get(suit);
        case 'ten':
            return tens.get(suit);
        case 'nine':
            return nines.get(suit);
        case 'eight':
            return eights.get(suit);
        case 'seven':
            return sevens.get(suit);
        case 'six':
            return sixes.get(suit);
        case 'five':
            return fives.get(suit);
        case 'four':
            return fours.get(suit);
        case 'three':
            return threes.get(suit);
        case 'two':
            return twos.get(suit);
        case 'a':
            return aces.get(suit);
        default:
            return '🃏';
    }
}

const propTypes = {
    face: PropTypes.string.isRequired,
    suit: PropTypes.string.isRequired,
};

export type PlayingCardProps = PropTypes.InferProps<typeof propTypes>;

const CardBox = styled.div`
    width: 132px;
    font-size: 8rem;
    cursor: pointer;
`;

const PlayingCard: React.FC<PlayingCardProps> = props => {
    const {
        face,
        suit,
    } = props;

    let color = 'black'

    if (suit.toLowerCase() === 'hearts' || suit.toLowerCase() === 'diamonds')
        color = '#ff5959';

    return (
        <CardBox 
            title={`${capitalize(face)} of ${suit.toLowerCase()}`}
            style={{ color }}
        >
            {getCard(face.toLowerCase(), suit.toLowerCase())}
        </CardBox>
    );
}

export default PlayingCard;
