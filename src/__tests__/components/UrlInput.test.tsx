import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import UrlInput from '../../components/UrlInput';

configure({ adapter: new Adapter() });

describe('UrlInput tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(
            <UrlInput 
                urlPrefix='http://localhost:3000/'
            />
        );

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
