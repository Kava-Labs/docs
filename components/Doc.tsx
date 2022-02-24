import {renderToString} from 'react-dom/server';

// container to render the markdown file 
function Doc({children}){
    

    return <>
        <main dangerouslySetInnerHTML={{__html:`${renderToString(children)}` }}>
        
        </main>
    </>;

};


export default Doc; 