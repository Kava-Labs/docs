import {renderToString} from 'react-dom/server';

// container to render the markdown file 
function Doc({children}){
    
    console.log(renderToString(children))
    return <>
        <main>
            {children}
        </main>
    </>;

};


export default Doc; 