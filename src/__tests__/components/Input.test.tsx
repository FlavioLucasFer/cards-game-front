import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Input from '../../components/Input';

configure({ adapter: new Adapter() });

describe('Input tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(<Input />);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
