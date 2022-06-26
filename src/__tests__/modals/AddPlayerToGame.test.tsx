import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import AddPlayerToGame from '../../modals/AddPlayerToGame';

configure({ adapter: new Adapter() });

const mockedHandleJoin = jest.fn();
const mockedUseDispatch = jest.fn();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux') as any,
    useDispatch: () => mockedUseDispatch,
}));

describe('AddPlayerToGame tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(
            <AddPlayerToGame 
                gameUuid='680fbf96-bf45-4ae5-8cce-a3d6d6e876bb'
                onJoin={mockedHandleJoin}
            />
        );

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
