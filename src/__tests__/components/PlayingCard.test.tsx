import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import PlayingCard from '../../components/PlayingCard';

configure({ adapter: new Adapter() });

describe('PlayingCard tests', () => {
    it('should render properly', () => {
        const wrapper = shallow(
            <PlayingCard 
                face='King'
                suit='Hearts'
            />
        );

        expect(wrapper.debug()).toMatchSnapshot();
    });
});
