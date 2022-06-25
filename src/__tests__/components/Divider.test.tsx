import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Divider from '../../components/Divider';

configure({ adapter: new Adapter() });

describe('Divider tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(<Divider />);

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
