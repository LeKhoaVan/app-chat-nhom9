import ChattingPage from './ChattingPage';
import MyChat from './MyChat';
import SideNavbar from './SideNavbar';
function DefaultLayout() {
    return ( 
        <div>
            <SideNavbar/>
            {/* <ChattingPage/> */}
            <MyChat/>
        </div>
    );
}

export default DefaultLayout; 