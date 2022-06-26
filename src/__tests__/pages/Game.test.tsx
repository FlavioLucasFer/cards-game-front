import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Game from '../../pages/Game';

configure({ adapter: new Adapter() });

const mockedUseNavigate = jest.fn();
const mockedUseSelector = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedUseNavigate,
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux') as any,
    useSelector: () => mockedUseSelector,
}));

jest.mock('moment', () => {
    return () => jest.requireActual('moment')('2020-01-01T00:00:00.000Z');
});

describe('Game tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(<Game />);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
