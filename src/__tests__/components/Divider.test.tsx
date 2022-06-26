import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Divider from '../../components/Divider';

configure({ adapter: new Adapter() });

describe('Divider tests', () => {
    it('should render properly (horizontal)', () => {
        const wrapper = shallow(<Divider />);

        expect(wrapper.debug()).toMatchSnapshot();
    });

    it('should render properly (vertical)', () => {
        const wrapper = shallow(
            <Divider 
                direction='vertical'
            />
        );

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
