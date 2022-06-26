import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Toast from '../../components/Toast';

configure({ adapter: new Adapter() });

describe('Toast tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(
            <Toast 
                title='Test'
            />
        );

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
