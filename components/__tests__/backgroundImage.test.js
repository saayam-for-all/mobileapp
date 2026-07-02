import { render, within } from "@testing-library/react-native";
import BackgroundImage, {styles} from "../BackgroundImage";
import { ImageBackground,Text } from "react-native";

describe('tests component',() =>{
    it('checks layout',() =>{
       const {getByTestId} = render(
            
            <BackgroundImage>
            <Text>helloWorld</Text>
            </BackgroundImage>
)

       const ImageBackground = getByTestId('mainComponent')
       
       expect(ImageBackground.props.blurRadius).toEqual(5)
       expect(ImageBackground).toBeTruthy()
    })
    it('checks children',()=>{
        
        
        
        const {getByTestId,getByText} = render(
            
            <BackgroundImage>
            <Text>helloWorld</Text>
            </BackgroundImage>
)
        const container = getByTestId('mainComponent')
        const TheChildText = getByText('helloWorld')

        expect(container).toBeTruthy()

        
        expect(TheChildText).toBeTruthy()



        //we need to see where does the children renders we now make 
})

        
    
    


})