import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal, { ModalProps } from 'react-bootstrap/Modal';
import axiosInstance from '../api';
import LabeledInput from '../components/Input';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Player, setPlayer } from '../redux/reducers/player';
import axios from 'axios';

const propTypes = {
    gameUuid: PropTypes.string.isRequired,
    onJoin: PropTypes.func.isRequired,
};

type AddPlayerToGameProps = ModalProps & PropTypes.InferProps<typeof propTypes>

const AddPlayerToGame: React.FC<AddPlayerToGameProps> = props => {
    const {
        gameUuid,
        onJoin,
        ...modalProps
    } = props;

    const dispatch = useDispatch();
    const [nickname, setNickname] = useState<string>('');

    const handleJoin = async () => {
        try {
            const { data } = await axiosInstance.post<Player>(
                `/games/${gameUuid}/players`, 
                { nickname },
            );

            dispatch(setPlayer(data));
            
            onJoin();
        } catch (err) {
            if (axios.isAxiosError(err))
                console.log('err:', err.response);
        }
    }

    const handleNicknameChange = (e: React.FormEvent<HTMLInputElement>) => {
        setNickname(e.currentTarget.value);
    }

    return (
        <Modal
            {...modalProps}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <LabeledInput 
                    id='nickname-input'
                    label='Nickname'
                    value={nickname}
                    onChange={handleNicknameChange}
                    autoFocus
                />
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    onClick={handleJoin}
                    disabled={!nickname}
                >
                    Join
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

AddPlayerToGame.propTypes = propTypes;

export default AddPlayerToGame;
