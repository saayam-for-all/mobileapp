import Slide, {styles} from "../../Banner/Slide";
import { render } from "@testing-library/react-native";

describe('checks slide styles', () =>{
    const item = {
        url:'fakeUrl',
    }
    
    it('check styles', () =>{
        const {getByText,getByTestId} = render(<Slide item={item} />)
    const firstView = getByTestId('viewOne')
    const firstImage =getByTestId('imageOne')
    const secondView = getByTestId('viewTwo')

    expect(firstView.props.style).toEqual(styles.cardView)
    expect(firstImage.props.style).toEqual(styles.image)
    expect(firstImage.props.source).toEqual({uri:item.url})
    expect(secondView.props.style).toEqual(styles.textView)

    })



})