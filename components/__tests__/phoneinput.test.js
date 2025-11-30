
import {PhoneInput,styles} from "../PhoneInput";

import {render,getByText,toBeNull,toBeTruthy,fireEvent} from '@testing-library/react-native'



describe('tests', () =>{
    it('renders',() =>{
        const {getByText} = render(<PhoneInput countryName={'Uganda'} countryCode={'+3'} />)

        
        expect(getByText('Uganda (+3)')).toBeTruthy()
        countryName = getByText('Uganda (+3)')
        
    })
    it('checks button on touchableOpacity, and checks dropdown',() => {

        
        


        const {getByTestId, queryByTestId} = render(<PhoneInput countryName={'Uganda'} countryCode={'+3'}  />)

        

        firstButton = getByTestId('buttonOne')
        expect(queryByTestId('countryCodesPickerFlatList')).toBeNull();

        fireEvent.press(firstButton);

 
        expect(getByTestId('countryCodesPickerFlatList')).toBeTruthy();
    }) 

    it('checks styles',() =>{
        const {getByText,getByTestId} = render(<PhoneInput countryName={'Uganda'} countryCode={'+3'}  />)

        firstView = getByTestId('viewOne')
        secondView = getByTestId('viewTwo')
        firstButton = getByTestId('buttonOne')
        firstText = getByTestId('textOne')
        dropdown = getByTestId('dropdownOne')
        textInput = getByTestId('textInputOne')

        // Need to export styles to continue

        
    })  
    
})
