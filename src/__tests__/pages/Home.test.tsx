import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Home from '../../pages/Home';

configure({ adapter: new Adapter() });

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedUsedNavigate,
}));

describe('Home tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(<Home />);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
