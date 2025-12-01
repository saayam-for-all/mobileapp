
import PhoneInput,{styles} from "../PhoneInput";

import {render,getByText,toBeNull,toBeTruthy,fireEvent} from '@testing-library/react-native'



describe('tests', () =>{
    it('renders',() =>{
        const {getByText} = render(<PhoneInput countryName={'Uganda'} countryCode={'+3'} />)

        
        expect(getByText('Uganda (+3)')).toBeTruthy()
        countryName = getByText('Uganda (+3)')
        
    })
    it('checks button on touchableOpacity, and checks dropdown',() => {

        
        


        const {getByTestId, queryByTestId,getAllByTestId} = render(<PhoneInput countryName={'Uganda'} countryCode={'+3'}  />)

        

        firstButton = getByTestId('buttonOne')
        expect(queryByTestId('countryCodesPickerFlatList')).toBeNull();

        fireEvent.press(firstButton);

 
        expect(getAllByTestId('dropDownOne')).toBeTruthy();
    }) 

    it('checks styles',() =>{
        const {getByText,getByTestId,getAllByTestId} = render(<PhoneInput countryName={'Uganda'} countryCode={'+3'}  />)

       const firstView = getByTestId('viewOne')
       const secondView = getByTestId('viewTwo')
       const firstButton = getByTestId('buttonOne')
      
       fireEvent.press(firstButton);
      // button styles dont run on test, should be tested in e2e  expect(firstButton.props.style).toEqual(styles.countryCode)
       const dropdown = getAllByTestId('dropDownOne')
       const firstText = getByTestId('textOne')
        
        const textInput = getByTestId('textInputOne')

        expect(firstView.props.style).toEqual({})
        expect(secondView.props.style).toEqual(styles.row)
        expect(textInput.props.style).toEqual(styles.phone)
        
        // Here i need the team to tell me wich features should be kept after render, and values
        
        dropdown
          .filter(node => node?.props?.style !== undefined)
        .forEach(node => {
        expect(node.props.style).toEqual({
            modal: { width: "100%" },
            itemsList: { flexGrow: 0, flexShrink: 0, flexBasis: "60%", height: "50vh", overflow: "hidden" },
            countryMessageContainer: { height: "60%", justifyContent: "" },
            searchMessageText: { padding: "5%" },  })  } )
  
                /*dropdown.forEach((node, index) => {
        expect(node.props.style).toEqual({
                    modal:{
                        width:"100%",
                    },
                    itemsList:{
                        overflow:"hidden",
                        height:"50vh",
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: "60%"
                    },
                    countryMessageContainer: {
                        height:"60%",
                        justifyContent:""
                    },
                    searchMessageText: {
                        padding: "5%"
                    },

                });
                });

        */
        

        // Need to export styles to continue

        
    })  
    
})
